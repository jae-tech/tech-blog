import { expect, test } from "@playwright/test";

test.describe("공개 페이지 — nav 존재 확인", () => {
  test("홈: nav 있고 어드민 헤더 없음", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "jae.tech" })).toBeVisible();
    await expect(page.getByRole("link", { name: "글" })).toBeVisible();
    await expect(page.getByRole("link", { name: "태그" })).toBeVisible();
    await expect(page.getByText("admin")).not.toBeVisible();
  });

  test("홈 → 글 목록 링크 클릭", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "글" }).click();
    await expect(page).toHaveURL("/posts");
    await expect(page.getByRole("link", { name: "jae.tech" })).toBeVisible();
  });

  test("홈 → 태그 링크 클릭", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "태그" }).click();
    await expect(page).toHaveURL("/tags");
  });

  test("글 목록 페이지: nav 있고 콘솔 에러 없음", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/posts");
    await expect(page.getByRole("link", { name: "jae.tech" })).toBeVisible();
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("태그 페이지: nav 있음", async ({ page }) => {
    await page.goto("/tags");
    await expect(page.getByRole("link", { name: "jae.tech" })).toBeVisible();
  });
});
