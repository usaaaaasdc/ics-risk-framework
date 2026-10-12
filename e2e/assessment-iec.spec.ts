import { expect, test } from "@playwright/test";
import { assessSystem } from "../lib/risk-engine";
import vulnerabilities from "../lib/data/vulnerabilities.json";
import { iec62443Standards } from "../lib/standards/iec62443";

const config = {
  deviceType: "PLC",
  manufacturer: "Siemens",
  model: "S7-1500",
  protocols: ["Modbus TCP"],
  interfaces: ["Ethernet"],
  internetConnected: true,
  connectedToIT: true,
  isLegacy: true,
  osVersion: "V2.9",
};
const result = assessSystem(config, vulnerabilities.vulnerabilities);
const project = {
  id: "ui05-project",
  name: "Line A · Review",
  description: "User project",
  industry: "Manufacturing",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  config,
  assessment: result,
};
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("app-language", "en"));
});

test("assessment restores saved calculations, inspects context, filters threats and exports", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript((p) => {
    if (!localStorage.getItem("ics-security-projects"))
      localStorage.setItem("ics-security-projects", JSON.stringify([p]));
  }, project);
  await page.goto("/assessment?projectId=ui05-project");
  await expect(
    page.getByRole("img", {
      name: `Overall Risk Score: ${Number(result.riskScore.toFixed(1))} / 10`,
    })
  ).toBeVisible();
  await expect(page.locator(".ac-factory-3d canvas")).toHaveAttribute("data-rendered", "true");
  const canvas = page.locator(".ac-factory-3d canvas");
  const initialCamera = await canvas.getAttribute("data-camera");
  expect(initialCamera).toBeTruthy();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(canvas).not.toHaveAttribute("data-camera", initialCamera!);
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-camera", initialCamera!);
  await expect(page.getByRole("combobox", { name: /Model/ })).toContainText(config.model);
  await page.getByRole("button", { name: "Inspect HMI · context", exact: true }).click();
  await expect(page.getByRole("region", { name: "Asset Details" })).toContainText("Not assessed");
  await page.getByRole("button", { name: `Inspect ${config.model}`, exact: true }).click();
  await page.getByRole("button", { name: "Network View", exact: true }).click();
  await expect(page.getByRole("button", { name: "Network View", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page.locator(".ac-factory-3d canvas")).toHaveCount(0);
  const riskOverlay = page
    .locator(".ac-environment-canvas svg")
    .getByText(result.riskScore.toFixed(1), { exact: true });
  await expect(riskOverlay).toHaveCount(1);
  await page.getByRole("button", { name: "Inspect HMI · context", exact: true }).click();
  await expect(riskOverlay).toHaveCount(0);
  await page.getByRole("button", { name: `Inspect ${config.model}`, exact: true }).click();
  await expect(riskOverlay).toHaveCount(1);
  await page.getByRole("button", { name: /Likelihood High, Impact High/ }).click();
  await expect(page.locator(".ac-threat-list details")).not.toHaveCount(0);
  await page.locator(".ac-threat-list summary").first().click();
  await expect(page.locator(".ac-threat-list details[open] p")).toBeVisible();
  await expect(page.locator(".ac-advanced [role=tablist]")).toBeHidden();
  await page.locator(".ac-advanced > summary").click();
  await page.getByRole("tab", { name: "IEC 62443", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Configuration-based indicators · Not a conformity assessment"
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV", exact: true }).click();
  expect(await (await download).failure()).toBeNull();
  await page.reload();
  await expect(
    page.getByRole("img", {
      name: `Overall Risk Score: ${Number(result.riskScore.toFixed(1))} / 10`,
    })
  ).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("ics-security-projects")!))
  ).toEqual(JSON.parse(JSON.stringify([project])));
  expect(errors).toEqual([]);
});

test("simple mode validates all five answers, preserves back navigation and calculates its existing result", async ({
  page,
}) => {
  await page.goto("/simple-mode");
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await page.getByRole("radio", { name: "Less than 2 years", exact: true }).check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("radio", { name: "No, completely isolated", exact: true }).check();
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(page.getByRole("radio", { name: "Less than 2 years", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("radio", { name: "Within last 3 months", exact: true }).check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("radio", { name: "No external access", exact: true }).check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("radio", { name: "Yes, comprehensive monitoring", exact: true }).check();
  await page.getByRole("button", { name: "Show Result", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Good Security Posture", exact: true })
  ).toBeVisible();
  await page.getByRole("button", { name: "Retake Assessment", exact: true }).click();
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
});

test("IEC review persists independently per project, retains calculator logic and never upgrades targets into results", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(
    (p) => localStorage.setItem("ics-security-projects", JSON.stringify([p])),
    project
  );
  await page.goto("/iec-calculator");
  await expect(page.getByTestId("iec-level")).toHaveText("Not assessed");
  await expect(page.getByTestId("iec-confirmed")).toHaveText("0");
  await page
    .getByRole("combobox", { name: "Target Security Levels: Control / PLC", exact: true })
    .selectOption("4");
  await page.getByRole("combobox", { name: "C2 SL-T", exact: true }).selectOption("3");
  await page
    .getByRole("combobox", { name: "Maturity Review: Governance", exact: true })
    .selectOption("2");
  const req = page.getByRole("checkbox", { name: /SR 1.1 Human User Identification/ });
  await req.check();
  await page.locator('summary[aria-label="SR 1.1 Details & evidence note"]').click();
  await page
    .getByRole("textbox", { name: "SR 1.1 Evidence reference / review note", exact: true })
    .fill("Maintenance review ticket #12 (unverified)");
  await page.reload();
  await expect(req).toBeChecked();
  await expect(page.getByTestId("iec-confirmed")).toHaveText("1");
  await expect(page.getByTestId("iec-level")).toHaveText("SL-0");
  await expect(
    page.getByRole("combobox", { name: "Target Security Levels: Control / PLC", exact: true })
  ).toHaveValue("4");
  await page.locator('summary[aria-label="SR 1.1 Details & evidence note"]').click();
  await expect(
    page.getByRole("textbox", { name: "SR 1.1 Evidence reference / review note", exact: true })
  ).toHaveValue("Maintenance review ticket #12 (unverified)");
  await page
    .getByRole("combobox", { name: "Assessment scope", exact: true })
    .selectOption(project.id);
  await expect(page.getByTestId("iec-confirmed")).toHaveText("0");
  for (const fr of iec62443Standards) {
    const trigger = page
      .locator("#iec-evidence")
      .getByRole("button", { name: new RegExp(`${fr.id} ·`) });
    if ((await trigger.getAttribute("data-state")) !== "open") await trigger.click();
    for (const r of fr.requirements) await page.locator(`[id="${r.id}"]`).check();
  }
  await expect(page.getByTestId("iec-level")).toHaveText("SL-2");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Assessment scope", exact: true })).toHaveValue(
    project.id
  );
  await expect(page.getByTestId("iec-level")).toHaveText("SL-2");
  await page
    .getByRole("combobox", { name: "Assessment scope", exact: true })
    .selectOption("planning");
  await expect(page.getByTestId("iec-confirmed")).toHaveText("1");
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("ics-security-projects")!))
  ).toEqual(JSON.parse(JSON.stringify([project])));
  expect(errors).toEqual([]);
});

test("assessment, simple and compliance routes remain readable on mobile and RTL", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of ["/assessment", "/simple-mode", "/iec-calculator", "/compliance-roadmap"]) {
    await page.goto(route);
    for (const language of ["en", "ar", "de", "tr"]) {
      await page
        .getByRole("combobox", { name: /Language|اللغة|Sprache|Dil/, exact: true })
        .selectOption(language);
      await expect(page.locator(".ac-workspace")).toHaveAttribute(
        "dir",
        language === "ar" ? "rtl" : "ltr"
      );
      if (route === "/iec-calculator") {
        await expect(page.locator(".ac-coverage bdi")).toHaveAttribute("dir", "ltr");
        await expect(page.locator(".ac-coverage bdi")).toContainText("0 / 15");
      }
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true
        );
      }
    }
  }
  expect(errors).toEqual([]);
});

test("compliance roadmap keeps its checklist and existing planning calculations", async ({
  page,
}) => {
  await page.goto("/compliance-roadmap");
  await page.getByRole("checkbox", { name: /User Identity Management/ }).check();
  await page.getByRole("button", { name: "Generate Roadmap", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Implementation Roadmap", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gap Analysis", exact: true })).toHaveCount(0);
  await expect(
    page.getByText("SL-3 / SL-4 are not evaluated", { exact: false }).first()
  ).toBeVisible();
});

test("assessment sections retain inputs and IEC N/A stays outside confirmed results", async ({
  page,
}) => {
  await page.addInitScript((c) => localStorage.setItem("quick-config", JSON.stringify(c)), config);
  await page.goto("/assessment");
  await expect(
    page.getByRole("img", { name: "Overall Risk Score: — / 10", exact: true })
  ).toBeVisible();
  const connectivity = page
    .locator(".ac-form-section")
    .filter({ has: page.locator("#protocol-Modbus\\ TCP") });
  await connectivity.locator("summary").click();
  await expect(page.locator('[id="protocol-Modbus TCP"]')).toBeHidden();
  await connectivity.locator("summary").click();
  await expect(page.getByRole("checkbox", { name: "Modbus TCP", exact: true })).toBeChecked();
  const exposure = page.locator(".ac-form-section").filter({ has: page.locator("#osVersion") });
  await expect(page.locator("#osVersion")).toBeHidden();
  await exposure.locator("summary").click();
  await expect(page.locator("#osVersion")).toHaveValue(config.osVersion);
  await expect(page.locator("#internetConnected")).toBeChecked();
  await exposure.locator("summary").click();
  await page.getByRole("button", { name: "Analyze Security", exact: true }).click();
  await expect(
    page.getByRole("img", {
      name: `Overall Risk Score: ${Number(result.riskScore.toFixed(1))} / 10`,
    })
  ).toBeVisible();

  await page.goto("/iec-calculator");
  const na = page.getByRole("button", { name: "SR 1.1 Not applicable (N/A)", exact: true });
  await na.click();
  await expect(na).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("iec-confirmed")).toHaveText("0");
  await expect(page.getByTestId("iec-na")).toHaveText("1");
  await expect(page.getByTestId("iec-level")).toHaveText("Not assessed");
  await page.locator('summary[aria-label="SR 1.1 Details & evidence note"]').click();
  await page
    .getByRole("textbox", { name: "SR 1.1 Evidence reference / review note", exact: true })
    .fill("Scope decision awaiting independent review");
  await page.reload();
  await expect(na).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("iec-level")).toHaveText("Not assessed");
  await page.getByRole("checkbox", { name: /SR 1.1 Human User Identification/ }).check();
  await expect(na).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("iec-na")).toHaveText("0");
  await expect(page.getByTestId("iec-confirmed")).toHaveText("1");
  await expect(page.getByTestId("iec-level")).toHaveText("SL-0");
  const search = page.getByRole("textbox", {
    name: "Evidence & Assessment Checklist",
    exact: true,
  });
  await search.fill("FR7");
  await expect(page.locator('[id="SR 7.1"]')).toBeVisible();
  await search.fill("no-such-requirement");
  await expect(page.getByText("No matching requirements", { exact: true })).toBeVisible();
});
