import { expect, test } from "@playwright/test";
import { riskSimulationCopy as copy } from "../lib/risk-simulation-copy";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("app-language", "en"));
});

test("all five scenarios drive the map, timeline and engine-backed assumptions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/risk-simulation");
  const scenarios = page.getByRole("group", { name: "Selected Scenario", exact: true });
  const path = page.getByRole("region", { name: copy.en.path });
  const timeline = page.getByRole("region", { name: copy.en.timeline });
  for (const [i, name] of copy.en.scenarios.entries()) {
    const scenario = scenarios.getByRole("button", {
      name: new RegExp(name.replace(/[()]/g, "\\$&")),
    });
    await scenario.click();
    await expect(scenario).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".rs-scenario-identity h3")).toHaveText(name);
    await expect(path.getByRole("button", { name: "Play stages", exact: true })).toBeDisabled();
    await path.getByRole("button", { name: "Inspect stage 6: PLC-01", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(path.locator(".rs-stage-inspector strong")).toHaveText(copy.en.actions[i][5]);
    await expect(timeline.getByRole("button").nth(5)).toHaveAttribute("aria-pressed", "true");
    await expect(path.locator("[data-active-path=true]")).toHaveCount(5);
    await timeline.getByRole("button").nth(2).click();
    await expect(path.getByRole("button", { name: "Inspect stage 3: Firewall" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await path.getByRole("button", { name: "Next stage", exact: true }).click();
    await expect(timeline.getByRole("button").nth(3)).toHaveAttribute("aria-pressed", "true");
  }
  await scenarios.getByRole("button", { name: /Ransomware/ }).click();
  const risk = page.locator(".rs-metrics").getByRole("img", { name: /^Modeled risk:/ });
  expect(parseFloat((await risk.getAttribute("aria-label"))!.split(":")[1])).toBeGreaterThan(80);
  await page.locator(".rs-assumptions summary").click();
  const mitigation = page.getByRole("slider", { name: "Mitigation assumption", exact: true });
  await mitigation.fill("0.95");
  expect(parseFloat((await risk.getAttribute("aria-label"))!.split(":")[1])).toBeLessThan(10);
  await page.getByRole("button", { name: "Reset assumptions", exact: true }).click();
  await expect(mitigation).toHaveValue("0.05");
  await page.getByRole("button", { name: "Model step 0", exact: true }).click();
  await expect(page.locator(".rs-trend output")).toHaveText("0.0%");
  await page.getByRole("button", { name: "Model step 24", exact: true }).click();
  expect(parseFloat((await page.locator(".rs-trend output").textContent())!)).toBeGreaterThan(90);
  await page.getByRole("button", { name: "Improve network segmentation", exact: true }).click();
  await expect(page.locator(".rs-recommendations")).toContainText(
    "allow only required industrial conduits"
  );
  await expect(page.getByRole("note")).toContainText("not validated probabilities or predictions");
  expect(errors).toEqual([]);
});

test("stage playback and zoom controls work without mutating model inputs", async ({ page }) => {
  await page.goto("/risk-simulation");
  const map = page.locator(".rs-attack-map");
  const width = (await map.locator(".rs-map-scroll > svg").boundingBox())!.width;
  const percentile = await page.getByTestId("risk-percentiles").textContent();
  await map.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect
    .poll(async () => (await map.locator(".rs-map-scroll > svg").boundingBox())!.width)
    .toBeGreaterThan(width);
  await map.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect
    .poll(async () => (await map.locator(".rs-map-scroll > svg").boundingBox())!.width)
    .toBe(width);
  await page.getByRole("button", { name: "Play stages", exact: true }).click();
  await expect(page.locator(".rs-timeline button").nth(1)).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pause stages", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play stages", exact: true })).toBeEnabled();
  await expect(page.getByTestId("risk-percentiles")).toHaveText(percentile!);
});

test("direct load and refresh preserve saved assessment devices and scores", async ({ page }) => {
  const saved = [
    {
      id: "real-project",
      name: "Packaging assessment",
      industry: "Manufacturing",
      description: "",
      createdAt: "2026-10-11",
      updatedAt: "2026-10-11",
      config: {
        deviceType: "PLC",
        manufacturer: "Siemens",
        model: "S7-1500",
        protocols: ["PROFINET"],
      },
      assessment: { riskScore: 6.2 },
    },
  ];
  await page.addInitScript(
    (data) => localStorage.setItem("ics-security-projects", JSON.stringify(data)),
    saved
  );
  await page.goto("/risk-simulation");
  for (const refresh of [false, true]) {
    if (refresh) await page.reload();
    await expect(page.getByRole("combobox", { name: "Simulation scope", exact: true })).toHaveValue(
      "real-project"
    );
    await expect(page.locator(".rs-baseline")).toContainText("6.2 / 10");
    await expect(page.locator(".rs-metrics > div").nth(1).locator("strong")).toHaveText("1");
    await page.getByRole("button", { name: "Inspect stage 6: S7-1500", exact: true }).click();
    await expect(page.locator(".rs-stage-inspector")).toContainText("Siemens");
    await expect(page.locator(".rs-stage-inspector")).toContainText("PROFINET");
    expect(
      await page.evaluate(() => JSON.parse(localStorage.getItem("ics-security-projects")!))
    ).toEqual(saved);
  }
  await page.getByRole("combobox", { name: "Simulation scope", exact: true }).selectOption("demo");
  await expect(
    page.getByRole("button", { name: "Inspect stage 6: PLC-01", exact: true })
  ).toBeVisible();
  await expect(page.locator(".rs-baseline")).toContainText("Not available");
});

test("mobile and RTL layouts retain accessible map and scenario controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/risk-simulation");
  for (const language of ["en", "ar", "de", "tr"] as const) {
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      // Desktop navigation is visible at tablet widths; mobile uses the drawer.
      if (width < 761)
        await page
          .getByRole("button", {
            name: /Toggle navigation|تبديل التنقل|Navigation umschalten|Gezinmeyi/,
          })
          .first()
          .click();
      if (width < 761) {
        await expect(page.locator(".rs-menu-close")).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(page.locator(".rs-language select")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.locator(".rs-menu-close")).toBeFocused();
      }
      await page.locator(".rs-language select").selectOption(language);
      if (width < 761) await page.keyboard.press("Escape");
      await expect(page.locator(".rs-workspace")).toHaveAttribute(
        "dir",
        language === "ar" ? "rtl" : "ltr"
      );
      await expect(page.locator(".rs-zones")).toHaveCSS("direction", "ltr");
      for (const value of await page
        .locator(".rs-gauge > span, .rs-metrics > div > strong")
        .all()) {
        await expect(value).toHaveCSS("direction", "ltr");
      }
      const scenarios = page.locator(".rs-scenarios button");
      await scenarios.nth(2).click();
      await expect(scenarios.nth(2)).toHaveAttribute("aria-pressed", "true");
      const plc = page.locator(".rs-map-node").nth(5);
      await plc.focus();
      await page.keyboard.press("Space");
      await expect(plc).toHaveAttribute("aria-pressed", "true");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
    }
  }
});

test("advanced Monte Carlo, Markov, network and traffic tools remain available", async ({
  page,
}) => {
  await page.goto("/risk-simulation");
  await page.locator(".rs-advanced > summary").click();
  await expect(page.getByRole("tab", { name: "Risk Sim", exact: true })).toBeVisible();
  await expect(page.getByText("Monte Carlo Risk Simulation", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Attack Path", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("24 model steps, not elapsed time");
  await page.getByRole("tab", { name: "Network Map", exact: true }).click();
  await expect(page.getByRole("tabpanel").locator('svg[viewBox="0 0 500 250"]')).toBeVisible();
  await expect(page.getByRole("tabpanel")).toContainText("PLC-1 (S7-1500)");
  await page.getByRole("tab", { name: "Traffic Analysis", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("JSON");
  await page.getByRole("button", { name: "Load Sample", exact: true }).click();
  await page.getByRole("button", { name: "Analyze Traffic", exact: true }).click();
  await expect(page.getByRole("tabpanel").getByRole("table")).toContainText("192.168.1.50");
  await page.getByRole("tab", { name: "Risk Sim", exact: true }).click();
  await expect(page.locator(".rs-advanced").getByRole("slider").first()).toHaveAttribute(
    "aria-valuenow",
    "9.5"
  );
  await page.locator(".rs-advanced > summary").click();
  await page.locator(".rs-advanced > summary").click();
  await expect(page.locator(".rs-advanced").getByRole("slider").first()).toHaveAttribute(
    "aria-valuenow",
    "9.5"
  );
});
