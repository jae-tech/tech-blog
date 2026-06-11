import { describe, expect, it } from "vitest";
import { normalizeTag, truncate } from "@/lib/utils/string";

describe("normalizeTag", () => {
  it("태그를 소문자로 변환한다", () => {
    expect(normalizeTag("TypeScript")).toBe("typescript");
  });

  it("앞뒤 공백을 제거한다", () => {
    expect(normalizeTag("  react  ")).toBe("react");
  });

  it("공백을 하이픈으로 변환한다", () => {
    expect(normalizeTag("next js")).toBe("next-js");
  });
});

describe("truncate", () => {
  it("maxLength 이하면 원문 반환한다", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("maxLength 초과 시 말줄임표를 붙인다", () => {
    const result = truncate("hello world", 5);
    expect(result).toBe("hello…");
  });

  it("정확히 maxLength일 때 원문 반환한다", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});
