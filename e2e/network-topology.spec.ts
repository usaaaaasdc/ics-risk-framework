import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("app-language", "en"));
});

test("overview shares selection and risk layers between real 2D and retained 3D", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const viewer = page.locator(".cc-industrial-viewer");
  await expect(viewer).toHaveAttribute("data-mode", "2d");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Inspect HMI-04, Operator workstation", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("SIMATIC HMI Comfort");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Show interactive 3D", exact: true }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-rendered", "true");
  await expect(
    page.getByRole("button", { name: "Inspect HMI-04, Operator workstation", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await canvas.evaluate((element) => element.setAttribute("data-retention-test", "same-canvas"));
  await page.getByRole("button", { name: "Risk overlay", exact: true }).click();
  await expect(page.locator(".cc-3d-risk")).toHaveCount(0);
  await page.getByRole("button", { name: "Show 2D topology", exact: true }).click();
  await expect(viewer).toHaveAttribute("data-mode", "2d");
  await expect(canvas).toBeHidden();
  await expect(page.locator('[data-node-id="HMI-04"]')).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator('[data-node-id="HMI-04"] > text').filter({ hasText: "Risk 8.4" })
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Show interactive 3D", exact: true }).click();
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute("data-retention-test", "same-canvas");
  await expect(page.getByRole("button", { name: "Risk overlay", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
});

test("radar inspects nodes, exposes attack paths and exports self-contained SVG", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/network-topology");
  await expect(page.getByRole("heading", { name: "Plant network radar" })).toBeVisible();
  await expect(page.locator(".nt-source-badge")).toHaveText("Demo data");
  const map = page.locator(".nt-map > svg");
  await expect(map.locator('[role="button"]')).toHaveCount(8);
  await map.getByRole("button", { name: "Inspect HMI-01", exact: true }).focus();
  await page.keyboard.press("Enter");
  const inspector = page.getByRole("complementary", { name: "Asset details" });
  await expect(inspector).toContainText("Rockwell");
  await expect(inspector).toContainText("EtherNet/IP");
  await expect(map.locator('[data-attack="true"]')).toHaveCount(2);
  await page.getByRole("button", { name: "Attack paths", exact: true }).click();
  await expect(map.locator('[data-attack="true"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Attack paths", exact: true }).click();
  const transform = await map.locator(":scope > g").getAttribute("transform");
  await page.getByRole("button", { name: "Zoom topology in", exact: true }).click();
  await expect(map.locator(":scope > g")).not.toHaveAttribute("transform", transform!);
  await page.getByRole("button", { name: "Reset topology view", exact: true }).click();
  await expect(map.locator(":scope > g")).toHaveAttribute("transform", transform!);
  await inspector.getByRole("button", { name: /Firewall\/Gateway/ }).click();
  await expect(inspector.getByRole("status")).toHaveText("Bidirectional · Unencrypted");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export SVG", exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/^network-topology-\d+\.svg$/);
  const svg = await readFile((await download.path())!, "utf8");
  expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  expect(svg).toContain("PLC-3A");
  expect(svg).toContain("Operations / DMZ");
  expect(svg).toContain("Demo data");
  expect(svg).toContain('data-attack="true"');
  expect(svg).not.toContain("<image");
  await page.getByRole("textbox", { name: "Search nodes, vendors or protocols" }).fill("nonsense");
  await expect(page.getByText("No matching assets", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("saved projects, translations and mobile layout survive direct load and refresh", async ({
  page,
}) => {
  const projects = [
    {
      id: "saved-1",
      name: "Saved process",
      config: {
        devices: [
          {
            name: "PLC-LOCAL",
            deviceType: "PLC",
            manufacturer: "Local vendor",
            protocol: "Modbus",
          },
        ],
      },
      assessment: { riskScore: 8.2 },
    },
  ];
  await page.addInitScript((data) => {
    if (!localStorage.getItem("ics-security-projects"))
      localStorage.setItem("ics-security-projects", JSON.stringify(data));
  }, projects);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/network-topology");
  const inspector = page.getByRole("complementary", { name: "Asset details" });
  await expect(inspector).toContainText("PLC-LOCAL");
  await expect(inspector).toContainText("8.2 / 10");
  await page.reload();
  await expect(inspector).toContainText("Local vendor");
  await page.getByRole("button", { name: "Toggle navigation", exact: true }).click();
  await page.getByRole("combobox", { name: "Topology source" }).selectOption("demo");
  await page.getByRole("button", { name: "Toggle navigation", exact: true }).last().click();
  await expect(inspector).toContainText("PLC-3A");
  await page.getByRole("combobox", { name: "Language", exact: true }).selectOption("de");
  await expect(page.getByRole("heading", { name: "Anlagen-Netzwerkradar" })).toBeVisible();
  await page.getByRole("combobox", { name: "Sprache", exact: true }).selectOption("tr");
  await expect(page.getByRole("heading", { name: "Tesis ağ radarı" })).toBeVisible();
  await page.getByRole("combobox", { name: "Dil", exact: true }).selectOption("ar");
  await expect(page.locator(".nt-workspace")).toHaveAttribute("dir", "rtl");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  }
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("ics-security-projects")!))
  ).toEqual(projects);
});
