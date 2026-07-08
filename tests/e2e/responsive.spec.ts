import { expect, test } from "@playwright/test";

test("首页展示品牌和海报网格", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "在线影院热播" })).toBeVisible();
  const grid = page.locator(".poster-grid").first();
  await expect(grid).toBeVisible();

  const columnCount = await grid.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  );
  expect(columnCount).toBe(test.info().project.name === "mobile" ? 3 : 6);
});

test("健康检查返回正常状态", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "online-video" });
});

test("网站主题可切换并持久化", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("online-cinema-theme", "light"));
  await page.reload();
  await page.getByRole("button", { name: "切换到深色模式" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "切换到浅色模式" })).toBeVisible();
});
