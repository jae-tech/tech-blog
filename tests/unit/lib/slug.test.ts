import { describe, expect, it } from "vitest";
import { generateSlug } from "@/lib/utils/slug";

describe("generateSlug", () => {
  it("공백을 하이픈으로 변환한다", () => {
    expect(generateSlug("hello world")).toBe("hello-world");
  });

  it("대문자를 소문자로 변환한다", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("특수문자를 제거한다", () => {
    expect(generateSlug("next.js app router!")).toBe("nextjs-app-router");
  });

  it("앞뒤 하이픈을 제거한다", () => {
    expect(generateSlug("  hello world  ")).toBe("hello-world");
  });

  it("연속 공백을 단일 하이픈으로 변환한다", () => {
    expect(generateSlug("hello   world")).toBe("hello-world");
  });

  it("빈 문자열을 처리한다", () => {
    expect(generateSlug("")).toBe("");
  });
});
