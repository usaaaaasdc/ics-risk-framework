import { expect, test, type Locator, type Page } from "@playwright/test";

function captureGeometry(canvas: Locator) {
  // Projected labels are DOM siblings over the canvas; omit them from pixel evidence.
  return canvas.screenshot({ style: ".cc-projected-labels { visibility: hidden !important; }" });
}

async function loadPausedScene(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.getByRole("img", { name: /3D industrial assembly cell/ });
  await expect(canvas).toHaveAttribute("data-rendered", "true");
  await expect(canvas).toHaveAttribute("data-camera", /-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+/);
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "paused");
  return canvas;
}

test("software WebGL starts efficiently even when reduced motion keeps the scene idle", async ({
  page,
}) => {
  // Override only the renderer identification; geometry still uses real WebGL.
  // This reproduces a CPU renderer even on developer machines with a hardware GPU.
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (parameter: number) {
      if (parameter === 0x9246) return "ANGLE (Google, Vulkan SwiftShader Device)";
      return original.call(this, parameter);
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveAttribute("data-rendered", "true");
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute(
    "data-quality",
    "Efficient · 1×"
  );
  await page.getByRole("button", { name: "Inspect PLC-01, Assembly controller" }).click();
  await expect(page.getByRole("dialog")).toContainText("Siemens S7-1500");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("scene motion can pause and resume actual rendered geometry", async ({ page }) => {
  // Leave time for software WebGL startup, without extending individual assertions.
  test.setTimeout(45_000);
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-rendered", "true");
  await page.getByRole("button", { name: "Pause scene animation", exact: true }).click();
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "paused");
  let paused = await captureGeometry(canvas);
  // Allow the last queued GPU frame and adaptive-quality update to settle.
  await expect
    .poll(async () => {
      const current = await captureGeometry(canvas);
      const stable = paused.equals(current);
      paused = current;
      return stable;
    })
    .toBe(true);
  expect(paused.equals(await captureGeometry(canvas))).toBe(true);
  await page.getByRole("button", { name: "Play scene animation", exact: true }).click();
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "running");
  // Let resumed frames reach the renderer, then pause before GPU readback. Reading
  // a continuously rendering software canvas starves screenshot capture on Linux.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        )
      )
  );
  await page.getByRole("button", { name: "Pause scene animation", exact: true }).click();
  await expect(page.locator(".cc-industrial-viewer")).toHaveAttribute("data-motion", "paused");
  await expect
    .poll(async () => paused.equals(await captureGeometry(canvas)), { timeout: 15_000 })
    .toBe(false);
});

test("real 3D camera supports orbit buttons, reset, pointer drag and wheel zoom", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const canvas = await loadPausedScene(page);
  const initial = await canvas.getAttribute("data-camera");
  await page.getByRole("button", { name: "Orbit right", exact: true }).click();
  await expect(canvas).not.toHaveAttribute("data-camera", initial!);
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-camera", initial!);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(canvas).not.toHaveAttribute("data-camera", initial!);
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();

  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + bounds.height * 0.75);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.7, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(canvas).not.toHaveAttribute("data-camera", initial!);
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  await canvas.hover({ position: { x: bounds.width * 0.8, y: bounds.height * 0.8 } });
  await page.mouse.wheel(0, -100);
  await expect(canvas).not.toHaveAttribute("data-camera", initial!);
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-camera", initial!);
  expect(errors).toEqual([]);
});

test("real 3D layers change rendered pixels and meshes remain inspectable when expanded", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const canvas = await loadPausedScene(page);
  const networkOn = await captureGeometry(canvas);
  await page.getByRole("button", { name: "Network", exact: true }).click();
  await expect(page.getByRole("button", { name: "Network", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  const networkOff = await captureGeometry(canvas);
  // Compares the actual WebGL canvas pixels, excluding DOM buttons and labels.
  expect(networkOn.equals(networkOff)).toBe(false);
  await page.getByRole("button", { name: "Risk overlay", exact: true }).click();
  await expect(page.locator(".cc-3d-risk")).toHaveCount(0);

  const asset = (await page
    .getByRole("button", { name: "Inspect RTU-03, Remote telemetry unit", exact: true })
    .boundingBox())!;
  // Click the modeled cabinet beneath its projected label, not the label button.
  await page.mouse.click(asset.x + asset.width / 2, asset.y + asset.height + 45);
  await expect(page.getByRole("dialog")).toContainText("Schneider SCADAPack");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Expand 3D scene", exact: true }).click();
  await expect(page.locator(".cc-industrial-viewer")).toHaveClass(/is-expanded/);
  await page
    .getByRole("button", { name: "Inspect ROBOT-01, Robot arm / PLC-01 controlled", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.locator(".cc-industrial-viewer")).not.toHaveClass(/is-expanded/);
  expect(errors).toEqual([]);
});

test("lost WebGL context falls back to labeled, inspectable 2D topology", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-rendered", "true");
  await canvas.evaluate((element) => {
    const gl = (element as HTMLCanvasElement).getContext("webgl2");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("WebGL context-loss extension unavailable");
    extension.loseContext();
  });
  await expect(page.getByText("3D renderer unavailable", { exact: true })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Inspect PLC-01, Assembly controller", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Siemens S7-1500");
});

test("unsupported WebGL keeps asset inspection available without claiming 3D", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
        if (kind.includes("webgl")) return null;
        return Reflect.apply(original, this, [kind, ...args]);
      },
    });
  });
  await page.goto("/");
  await expect(page.getByText("3D renderer unavailable", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Orbit left", exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Inspect HMI-04, Operator workstation", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("SIMATIC HMI Comfort");
});
