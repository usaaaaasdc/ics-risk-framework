import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("dashboard chart and asset search open the correct inspection records", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  // Pause before waiting for WebGL startup. On a CPU renderer, waiting first
  // lets continuous animation consume the chart/search test's time budget.
  // The rendered-canvas assertions below still require genuine 3D output.
  await page.getByRole("button", { name: "Pause scene animation", exact: true }).click();
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "paused");
  const hero = page.getByRole("img", { name: /3D industrial assembly cell/ });
  await expect(hero).toBeVisible();
  await expect(hero).toHaveAttribute("data-rendered", "true");
  await page.getByRole("button", { name: "24H", exact: true }).click();
  await expect(
    page.getByRole("img", { name: /Overall risk trend over 24H: 7.1 to 6.4/ })
  ).toBeVisible();

  await page.getByRole("button", { name: "Inspect PLC-01, Assembly controller" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Controller firmware is outside the approved baseline"
  );
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Search assets" }).fill("10.20.0.8");
  await page
    .getByRole("region", { name: "Search results" })
    .getByRole("button", { name: /GW-02/ })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Moxa EDR-G9010");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("asset filtering, CSV export and demo alert acknowledgement work", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Asset inventory/ }).click();
  // Wait for the incoming inventory view before filtering; the outgoing overview
  // also has a zone selector while its section transition completes.
  await expect(
    page.getByRole("heading", { name: "Asset intelligence", exact: true })
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Filter assets by zone" }).selectOption("DMZ");
  await expect(page.getByRole("row")).toHaveCount(2);
  await expect(page.getByRole("table")).toContainText("GW-02");
  await expect(page.getByRole("table")).not.toContainText("PLC-01");

  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export snapshot" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("ics-risk-demo-assets.csv");
  expect(await download.failure()).toBeNull();
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv.split("\r\n")).toHaveLength(7);
  expect(csv).toContain('"PLC-01","Assembly controller","Siemens S7-1500","10.20.1.12"');

  await page.getByRole("button", { name: "Notifications, 6 active alerts" }).click();
  await page.getByRole("button", { name: "Acknowledge AL-001", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("AL-001 acknowledged in this demo session.");
  await expect(page.getByRole("button", { name: "Notifications, 5 active alerts" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Acknowledge AL-001", exact: true })).toHaveCount(
    0
  );
  expect(errors).toEqual([]);
});

test("mobile asset rows keep every field and inspection control within the panel", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const panel = page.locator(".cc-assets");
    const rows = panel.locator("tbody tr");
    await expect(rows).toHaveCount(4);
    expect(
      await panel.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return [...element.querySelectorAll("tbody td")].every((cell) => {
          const rect = cell.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.left >= bounds.left &&
            rect.right <= bounds.right &&
            cell.scrollWidth <= cell.clientWidth
          );
        });
      })
    ).toBe(true);
    await expect(rows.first()).toContainText("Control");
    await expect(rows.first()).toContainText("9.2");
    await expect(rows.first()).toContainText("Critical");
    await panel.getByRole("button", { name: "Sort risk ascending", exact: true }).click();
    await expect(rows.first()).toContainText("HIS-01");
    await panel.getByRole("button", { name: "Sort risk descending", exact: true }).click();
    await panel.getByRole("button", { name: "Inspect PLC-01", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("Siemens S7-1500");
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  }
});

test("mobile navigation and asset inspection work with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Industrial Command Center");
  await expect(page.getByText("Assembly cell / 2D topology", { exact: true })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Launch interactive 3D", exact: true }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-rendered", "true");
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute(
    "data-quality",
    "Efficient · 1×"
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  await page.getByRole("button", { name: /Asset inventory/ }).click();
  await expect(
    page.getByRole("heading", { name: "Asset intelligence", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  await page.getByRole("button", { name: "Inspect PLC-01", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  );
});
