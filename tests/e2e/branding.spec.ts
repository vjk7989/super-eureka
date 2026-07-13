import { expect, test, type Page } from "@playwright/test";

test.describe("ESN LABS branding", () => {
  test("login shows ESN LABS logo and copy without overflow", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByTestId("esn-brand-lockup")).toBeVisible();
    await expect(page.getByRole("img", { name: "ESN LABS logo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ESN LABS AI Disease Command Center" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("app shell exposes ESN LABS brand on operational routes", async ({ page }) => {
    await page.goto("/admin/tree-grid");

    await expect(page.getByTestId("esn-brand-lockup").first()).toBeVisible();
    await expect(page.getByText("ESN LABS role")).toBeVisible();
    await expect(page.getByRole("img", { name: "ESN LABS logo" }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("map and overview carry ESN LABS branding", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByRole("heading", { name: "ESN LABS Interactive Map Dashboard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ESN LABS Oil Palm Disease Map" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/admin/overview");
    await expect(page.getByRole("heading", { name: "ESN LABS Command Overview" })).toBeVisible();
    await expect(page.getByTestId("overview-map-panel")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("mobile shell keeps ESN LABS logo inside viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/overview");

    await expect(page.locator('[data-testid="esn-brand-lockup"]:visible')).toBeVisible();
    await expect(page.locator('img[alt="ESN LABS logo"]:visible')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
}
