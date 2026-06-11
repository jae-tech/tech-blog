import { expect, test } from "@playwright/test";

test.describe("어드민 페이지 — 헤더 중복 없음", () => {
  test("로그인 페이지: 글로벌 nav 없음", async ({ page }) => {
    await page.goto("/admin/login");
    // 공개 nav의 jae.tech 로고 링크가 없어야 함
    const publicNavLogo = page
      .locator("header")
      .filter({ hasText: "jae.tech" });
    // 어드민 로그인 페이지는 자체 헤더가 없으므로 nav 자체가 없어야 함
    await expect(publicNavLogo).toHaveCount(0);
  });

  test("어드민 리다이렉트: /admin → /admin/login (미인증)", async ({
    page,
  }) => {
    await page.goto("/admin");
    // 인증 안된 상태에서 로그인 페이지로 리다이렉트되어야 함
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("어드민 posts 리다이렉트: 미인증 시 로그인으로", async ({ page }) => {
    await page.goto("/admin/posts");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("어드민 로그인 페이지 UI", () => {
  test("이메일/비밀번호 폼 존재", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel(/이메일/i)).toBeVisible();
    await expect(page.getByLabel(/비밀번호/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /로그인/i })).toBeVisible();
  });

  test("빈 폼 제출 시 에러 표시", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("button", { name: /로그인/i }).click();
    // 빈 폼이면 브라우저 validation 또는 서버 에러가 표시되어야 함
    // 최소한 페이지가 /admin/login에 머물러야 함
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
