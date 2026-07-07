import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs/promises";

test.describe("map-grid workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/map");
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(page.getByTestId("selection-grid")).toBeVisible();
    await expect(page.getByTestId("saved-map-grids")).toBeVisible();
  });

  test("initial map render has grid, saved-grid empty state, and no desktop overflow", async ({ page }) => {
    await expect(page.getByTestId("selection-mode-control")).toBeVisible();
    await expect(page.getByText("Create a grid from the current map to keep a temporary working set.")).toBeVisible();
    await expect.poll(() => visibleRowCount(page)).toBeGreaterThan(0);
    await expect.poll(() => page.getByTestId("operational-map").locator(".leaflet-interactive").count()).toBeGreaterThan(0);
    await expectNoHorizontalOverflow(page);
  });

  test("creates and deletes a saved map grid", async ({ page }) => {
    await createSavedGrid(page, "Smoke Current Grid");

    const card = savedGridCard(page, "Smoke Current Grid");
    await expect(card).toBeVisible();
    await expect(card.getByTestId("reopen-saved-grid")).toBeVisible();
    await expect(card.getByTestId("export-saved-grid")).toBeVisible();
    await expect(card.getByTestId("delete-saved-grid")).toBeVisible();

    await card.getByTestId("delete-saved-grid").click();
    await expect(savedGridCard(page, "Smoke Current Grid")).toHaveCount(0);
    await expect(page.getByText("Create a grid from the current map to keep a temporary working set.")).toBeVisible();
  });

  test("selects farm and field scopes from the map", async ({ page }) => {
    const initialRows = await visibleRowCount(page);

    await page.getByTestId("selection-mode-farm").click();
    await clickMapLayer(page, ".map-tree-GAVL-AP-01-B12-000342");
    await expect(page.getByText("Grid scope: Andhra Coastal Oil Palm Cluster")).toBeVisible();
    await expectRowCountBelow(page, initialRows);

    const farmRows = await visibleRowCount(page);
    await page.getByTestId("selection-mode-field").click();
    await clickMapLayer(page, ".map-tree-GAVL-AP-01-B12-000342");
    await expect(page.getByText("Grid scope: Block B12")).toBeVisible();
    await expectRowCountBelow(page, farmRows);
  });

  test("selects a tree from the grid and focuses the selected row", async ({ page }) => {
    const firstRow = page.getByTestId("tree-grid-row").first();
    const treeCode = (await firstRow.locator("td").first().innerText()).trim();

    await firstRow.locator("td").nth(1).click();

    await expect(page.getByText("Selected tree")).toBeVisible();
    await expect(page.getByText(`Grid scope: ${treeCode}`)).toBeVisible();
    await expect(page.getByTestId("tree-grid-row")).toHaveCount(1);
    await expect(page.locator('tr[aria-selected="true"]')).toHaveCount(1);
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });

  test("reopens a saved scoped grid after selection changes", async ({ page }) => {
    await page.getByTestId("selection-mode-farm").click();
    await clickMapLayer(page, ".map-tree-GAVL-AP-01-B12-000342");
    const savedCount = await visibleRowCount(page);
    await createSavedGrid(page, "Andhra Farm Grid");

    await page.getByTestId("selection-mode-field").click();
    await clickMapLayer(page, ".map-tree-GAVL-AP-01-B12-000342");
    await expect(page.getByText("Grid scope: Block B12")).toBeVisible();

    await savedGridCard(page, "Andhra Farm Grid").getByTestId("reopen-saved-grid").click();

    await expect(page.getByText("Grid scope: Andhra Coastal Oil Palm Cluster")).toBeVisible();
    await expectVisibleRowCount(page, savedCount);
  });

  test("exports saved grid CSV from saved tree ids", async ({ page }) => {
    await createSavedGrid(page, "Csv Saved Grid");

    const downloadPromise = page.waitForEvent("download");
    await savedGridCard(page, "Csv Saved Grid").getByTestId("export-saved-grid").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("csv-saved-grid.csv");
    const path = await download.path();
    expect(path).toBeTruthy();
    const csv = await fs.readFile(path!, "utf8");
    expect(csv).toContain("treeCode");
    expect(csv).toContain("currentHealthStatus");
    expect(csv).toContain("GAVL-");
  });

  test("handles empty results and reset", async ({ page }) => {
    await page.getByLabel("From", { exact: true }).fill("2099-01-01");
    await page.getByLabel("To", { exact: true }).fill("2099-01-02");

    await expect(page.getByText("No trees match the current filters.")).toBeVisible();
    await expect(page.getByTestId("create-map-grid")).toBeDisabled();

    await page.getByTestId("reset-map-filters").click();

    await expect(page.getByText("Grid scope: All visible map data")).toBeVisible();
    await expect.poll(() => visibleRowCount(page)).toBeGreaterThan(0);
  });

  test("mobile layout keeps map, grid, saved grids, and avoids overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/map");

    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(page.getByTestId("selection-grid")).toBeVisible();
    await expect(page.getByTestId("saved-map-grids")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});

function savedGridCard(page: Page, name: string) {
  return page.getByTestId("saved-map-grid-card").filter({ hasText: name });
}

async function createSavedGrid(page: Page, name: string) {
  await page.getByLabel("Map grid name").fill(name);
  await page.getByTestId("create-map-grid").click();
  await expect(savedGridCard(page, name)).toBeVisible();
}

async function visibleRowCount(page: Page) {
  return page.getByTestId("tree-grid-row").count();
}

async function expectVisibleRowCount(page: Page, count: number) {
  await expect.poll(() => visibleRowCount(page)).toBe(count);
}

async function expectRowCountBelow(page: Page, count: number) {
  await expect.poll(() => visibleRowCount(page)).toBeLessThan(count);
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
}

async function clickMapLayer(page: Page, selector: string) {
  const layer = page.locator(selector);
  await expect(layer).toHaveCount(1);
  await layer.dispatchEvent("click");
}
