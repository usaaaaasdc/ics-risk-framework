import { test, expect } from "@playwright/test";
import { assessSystem } from "../lib/risk-engine";
import vulnerabilities from "../lib/data/vulnerabilities.json";
import { AIRiskPredictor } from "../lib/ai-risk-prediction";

const config = {
  deviceType: "PLC",
  manufacturer: "Siemens",
  model: "S7-1500",
  protocols: ["Modbus TCP"],
  interfaces: ["Ethernet"],
  internetConnected: true,
  connectedToIT: true,
  isLegacy: true,
};
const result = assessSystem(config, vulnerabilities.vulnerabilities);
const projects = [
  {
    id: "line-a",
    name: "Line A assessment",
    description: "",
    industry: "Manufacturing",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    config,
    assessment: result,
  },
  {
    id: "draft",
    name: "Pending HMI review",
    description: "",
    industry: "Manufacturing",
    createdAt: "2026-01-02",
    updatedAt: "2026-01-02",
    config: { ...config, deviceType: "HMI", model: "PanelView" },
    assessment: null,
  },
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("app-language", "en"));
});

test("empty analytics and AI never manufacture results, CVEs or compliance", async ({ page }) => {
  await page.goto("/analytics");
  await expect(page.getByRole("heading", { name: "No saved assessments yet" })).toBeVisible();
  await expect(page.locator(".in-metric").nth(3)).toContainText("—");
  await expect(page.locator(".in-evidence")).toContainText("Not assessed");
  await expect(page.locator("main")).not.toContainText("65%");
  await page.locator(".ac-sidebar").getByRole("link", { name: "AI risk analysis" }).click();
  await expect(page.getByRole("button", { name: "Run heuristic analysis" })).toBeDisabled();
  await expect(page.getByRole("img", { name: "Heuristic risk index: — / 10" })).toBeVisible();
  await expect(page.locator(".in-workspace canvas")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/CVE-|Confidence Level:|65%/);
});

test("analytics filters saved assessments, distinguishes drafts and preserves records after refresh", async ({
  page,
}) => {
  await page.addInitScript(
    (data) => localStorage.setItem("ics-security-projects", JSON.stringify(data)),
    projects
  );
  await page.goto("/analytics");
  await expect(page.locator(".in-metric").nth(3)).toContainText(
    `${result.riskScore.toFixed(1)} / 10`
  );
  await expect(page.locator(".in-metric").nth(1)).toContainText("1");
  await page.getByRole("button", { name: /Pending HMI review/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Assessment details", exact: true })).toContainText(
    "Not assessed"
  );
  await expect(
    page.getByRole("region", { name: "Assessment details", exact: true }).getByRole("link")
  ).toHaveAttribute("href", "/assessment?projectId=draft");
  await page.getByRole("combobox", { name: "Project scope" }).selectOption("draft");
  await expect(page.locator(".in-node")).toHaveCount(1);
  await expect(page.locator(".in-metric").nth(3)).toContainText("—");
  await page.getByRole("combobox", { name: "Project scope" }).selectOption("line-a");
  if (result.vulnerabilities.length)
    await expect(page.locator(".in-table-wrap")).toContainText(result.vulnerabilities[0].id);
  await page.getByRole("button", { name: "Refresh saved data" }).click();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("ics-security-projects")!))
  ).toEqual(JSON.parse(JSON.stringify(projects)));
});

test("AI analysis uses the selected project and unchanged engine, invalidates stale results and gates drafts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(
    (data) => localStorage.setItem("ics-security-projects", JSON.stringify(data)),
    projects
  );
  await page.goto("/ai-prediction");
  const run = page.getByRole("button", { name: "Run heuristic analysis" });
  await expect(run).toBeDisabled();
  await page.getByRole("combobox", { name: "Project scope" }).selectOption("line-a");
  await expect(page.getByRole("region", { name: "Analysis inputs" })).toContainText("S7-1500");
  await run.click();
  const prediction = new AIRiskPredictor().predictRisk(
    [
      {
        type: config.deviceType,
        manufacturer: config.manufacturer,
        protocols: config.protocols,
        internetExposed: config.internetConnected,
        isLegacy: config.isLegacy,
        riskScore: result.riskScore,
        vulnerabilitiesFound: result.vulnerabilities.length,
      },
    ],
    "Manufacturing"
  );
  await expect(
    page.getByRole("img", {
      name: `Heuristic risk index: ${Number(prediction.predictedRiskScore.toFixed(1))} / 10`,
    })
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Engine recommendations" })).toContainText(
    prediction.recommendations[0]
  );
  await expect(page.locator(".in-analysis-result")).toContainText(
    "not a predicted incident likelihood"
  );
  await expect(page.locator(".in-analysis-result")).not.toContainText(
    /%|Confidence Level:|Probability:/i
  );
  await page.getByRole("combobox", { name: "Project scope" }).selectOption("draft");
  await expect(run).toBeDisabled();
  await expect(page.getByRole("img", { name: "Heuristic risk index: — / 10" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Engine recommendations" })).toHaveCount(0);
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem("ics-risk-history"))).toBeNull();
  expect(errors).toEqual([]);
});

test("malformed storage shows recoverable states and remains unchanged", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ics-security-projects", "broken");
    localStorage.setItem("ics-risk-history", '[{"devices":[]}]');
  });
  await page.goto("/analytics");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "nothing has been overwritten"
  );
  await page.evaluate(
    (data) => localStorage.setItem("ics-security-projects", JSON.stringify(data)),
    projects
  );
  await page.getByRole("button", { name: "Refresh saved data" }).click();
  await expect(page.locator(".in-node")).toHaveCount(2);
  await page.locator(".ac-sidebar").getByRole("link", { name: "AI risk analysis" }).click();
  // The init script runs on full navigations only, not client-side route changes.
  await expect(page.getByRole("status")).toContainText("Historical records are unreadable");
  expect(await page.evaluate(() => localStorage.getItem("ics-risk-history"))).toBe(
    '[{"devices":[]}]'
  );
});

test("both pages remain readable and keyboard-operable on mobile in all four languages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(
    (data) => localStorage.setItem("ics-security-projects", JSON.stringify(data)),
    projects
  );
  for (const route of ["/analytics", "/ai-prediction"]) {
    await page.goto(route);
    for (const language of ["ar", "de", "tr", "en"]) {
      await page.locator(".ac-language select").selectOption(language);
      await expect(page.locator(".ac-workspace")).toHaveAttribute(
        "dir",
        language === "ar" ? "rtl" : "ltr"
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
      await expect(page.locator("h1")).not.toBeEmpty();
      if (route === "/analytics")
        await expect(page.locator(".in-inspector-title > span")).toHaveCSS("direction", "ltr");
    }
    const scope = page.locator(".in-toolbar select");
    await scope.focus();
    await expect(scope).toBeFocused();
    await scope.selectOption("line-a");
    if (route === "/ai-prediction") {
      const run = page.getByRole("button", { name: "Run heuristic analysis" });
      await run.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("region", { name: "Engine recommendations" })).toBeVisible();
      await page.locator(".ac-language select").selectOption("ar");
      await expect(page.getByRole("region", { name: "توصيات المحرك" })).not.toContainText(
        "Implement"
      );
    }
  }
});
