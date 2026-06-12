import { expect, test } from "@playwright/test";

test.describe("공개 페이지 — nav 존재 확인", () => {
  test("system theme 토큰과 focus 계약", async ({ page }, testInfo) => {
    await page.goto("/posts");

    const expectedDark = testInfo.project.name.endsWith("dark");
    const tokens = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        background: styles.getPropertyValue("--background").trim(),
        foreground: styles.getPropertyValue("--foreground").trim(),
      };
    });

    expect(tokens).toEqual(
      expectedDark
        ? { background: "#0e0e10", foreground: "#f0eee8" }
        : { background: "#fafaf9", foreground: "#1a1a1c" },
    );

    const postsLink = page
      .locator("header")
      .getByRole("link", { name: "글", exact: true });
    await expect(postsLink).toHaveAttribute("aria-current", "page");
    await postsLink.focus();
    await expect(postsLink).toBeFocused();
    const focusStyle = await postsLink.evaluate((element) => {
      const style = getComputedStyle(element);
      return `${style.outlineStyle} ${style.outlineWidth}`;
    });
    expect(focusStyle).not.toContain("none");
    expect(focusStyle).not.toContain("0px");
  });

  test("skip link가 본문으로 이동", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "본문으로 건너뛰기" });
    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("홈: nav 있고 어드민 헤더 없음", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "jae.tech" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    // nav 안의 글/태그 링크 확인 (header 범위로 한정)
    const header = page.locator("header");
    await expect(
      header.getByRole("link", { name: "글", exact: true }),
    ).toBeVisible();
    await expect(
      header.getByRole("link", { name: "태그", exact: true }),
    ).toBeVisible();
    // 어드민 nav가 없어야 함 (header 안에 "admin" 링크 없음)
    await expect(header.getByRole("link", { name: "admin" })).toHaveCount(0);
  });

  test("홈 → 글 목록 링크 클릭", async ({ page }) => {
    await page.goto("/");
    // nav header 안의 글 링크만 클릭
    await page
      .locator("header")
      .getByRole("link", { name: "글", exact: true })
      .click();
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
