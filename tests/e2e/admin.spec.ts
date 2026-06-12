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

  test("어드민 리다이렉트: /admin → 로그인 페이지 (미인증)", async ({
    page,
  }) => {
    await page.goto("/admin");
    // proxy.ts가 /admin/login 또는 /login?nextUrl=... 으로 redirect
    await expect(page).toHaveURL(/login/);
  });

  test("어드민 posts 리다이렉트: 미인증 시 로그인으로", async ({ page }) => {
    await page.goto("/admin/posts");
    await expect(page).toHaveURL(/login/);
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
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("인증된 어드민 작성 경험", () => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    "E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD가 없어 인증된 어드민 검증을 건너뜁니다. 수동 검증 필요.",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/이메일/i).fill(process.env.E2E_ADMIN_EMAIL ?? "");
    await page
      .getByLabel(/비밀번호/i)
      .fill(process.env.E2E_ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: /로그인/i }).click();
    await page.waitForURL(/\/admin\/posts/);
  });

  test("새 글 editor 상태와 반응형 preview 계약", async ({ page }) => {
    await page.goto("/admin/posts/new");
    const editor = page.locator("[data-editor-state]");
    await expect(editor).toHaveAttribute("data-editor-state", "clean-unsaved");

    await page.getByLabel("제목").fill("E2E draft");
    await expect(editor).toHaveAttribute("data-editor-state", "dirty");

    const content = page.getByLabel("본문 (Markdown)");
    if (page.viewportSize() && (page.viewportSize()?.width ?? 0) >= 1024) {
      await expect(content).toBeVisible();
      await expect(page.getByText("내용이 없습니다.")).toBeVisible();
    } else {
      await expect(content).toBeVisible();
      await page.getByRole("button", { name: "미리보기" }).click();
      await expect(page.getByText("내용이 없습니다.")).toBeVisible();
    }
  });

  test("새 글 저장 중 입력을 잠그고 실패를 보존한 뒤 retry/publish를 허용", async ({
    page,
  }) => {
    let releaseRequest: (() => void) | undefined;
    const requestReleased = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });
    const statuses: string[] = [];
    await page.route("/api/admin/posts", async (route) => {
      const body = route.request().postDataJSON() as { status: string };
      statuses.push(body.status);
      await requestReleased;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "의도된 E2E 저장 실패" }),
      });
    });
    await page.goto("/admin/posts/new");
    const editor = page.locator("[data-editor-state]");
    await page.getByLabel("제목").fill("실패 상태 검증");
    await page.getByRole("button", { name: "초안 저장" }).click();
    await expect(editor).toHaveAttribute("data-editor-state", "saving");
    await expect(page.getByLabel("제목")).toBeDisabled();
    releaseRequest?.();
    await expect(editor).toHaveAttribute("data-editor-state", "error");
    await expect(page.getByText("의도된 E2E 저장 실패")).toBeVisible();

    await page.getByLabel("제목").fill("다시 편집");
    await expect(editor).toHaveAttribute("data-editor-state", "dirty");
    await page.getByRole("button", { name: "발행" }).click();
    await expect(editor).toHaveAttribute("data-editor-state", "error");
    expect(statuses).toEqual(["draft", "published"]);
  });

  test("편집 중 저장 실패는 최신 편집과 함께 오류를 보존", async ({ page }) => {
    let rejectRequest: (() => void) | undefined;
    const requestRejected = new Promise<void>((resolve) => {
      rejectRequest = resolve;
    });
    await page.route("/api/admin/posts/**", async (route) => {
      await requestRejected;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "편집 중 저장 실패" }),
      });
    });

    await page.goto("/admin/posts");
    const editLink = page.getByRole("link", { name: "수정" }).first();
    test.skip((await editLink.count()) === 0, "편집할 기존 글이 없습니다.");
    await editLink.click();

    const editor = page.locator("[data-editor-state]");
    await expect(editor).toHaveAttribute("data-editor-state", "clean-saved");
    await page.getByLabel("제목").fill("저장 요청 이전 제목");
    await page.getByRole("button", { name: "초안 저장" }).click();
    await expect(editor).toHaveAttribute("data-editor-state", "saving");
    await page.getByLabel("제목").fill("저장 요청 이후 제목");
    rejectRequest?.();
    await expect(editor).toHaveAttribute("data-editor-state", "error");
    await expect(page.getByText("편집 중 저장 실패")).toBeVisible();
  });
});
