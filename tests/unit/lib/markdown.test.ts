import { describe, expect, it } from "vitest";
import { extractExcerpt, extractHeadings } from "@/lib/markdown/utils";

describe("extractExcerpt", () => {
  it("Markdown 헤딩을 제거한다", () => {
    const md = "# 제목\n\n본문 텍스트입니다.";
    expect(extractExcerpt(md)).toBe("본문 텍스트입니다.");
  });

  it("링크 텍스트만 남긴다", () => {
    const md = "[Next.js](https://nextjs.org) 소개";
    expect(extractExcerpt(md)).toBe("Next.js 소개");
  });

  it("인라인 코드를 제거한다", () => {
    const md = "`const x = 1` 코드 예시";
    expect(extractExcerpt(md)).toBe("코드 예시");
  });

  it("maxLength를 초과하면 말줄임표를 붙인다", () => {
    const md = "a".repeat(200);
    const result = extractExcerpt(md, 160);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(161);
  });
});

describe("extractHeadings", () => {
  it("헤딩 레벨과 텍스트를 추출한다", () => {
    const md = "# 제목 1\n\n## 제목 2\n\n### 제목 3";
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(3);
    expect(headings[0]).toMatchObject({ level: 1, text: "제목 1" });
    expect(headings[1]).toMatchObject({ level: 2, text: "제목 2" });
    expect(headings[2]).toMatchObject({ level: 3, text: "제목 3" });
  });

  it("헤딩이 없으면 빈 배열을 반환한다", () => {
    expect(extractHeadings("본문만 있습니다.")).toEqual([]);
  });

  it("id를 소문자 하이픈 형식으로 생성한다", () => {
    const headings = extractHeadings("## Hello World");
    expect(headings[0].id).toBe("hello-world");
  });
});
