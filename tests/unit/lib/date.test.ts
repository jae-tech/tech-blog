import { describe, expect, it } from "vitest";
import { formatDate, formatDateISO } from "@/lib/utils/date";

describe("formatDate", () => {
  it("ISO 날짜를 한국어 형식으로 변환한다", () => {
    expect(formatDate("2024-01-15T00:00:00Z")).toBe("2024년 1월 15일");
  });
});

describe("formatDateISO", () => {
  it("YYYY-MM-DD 형식으로 반환한다", () => {
    expect(formatDateISO("2024-01-15T12:34:56Z")).toBe("2024-01-15");
  });
});
