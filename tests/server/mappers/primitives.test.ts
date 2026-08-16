import { describe, it, expect } from "vitest";
import {
  id,
  str,
  nullableStr,
  num,
  nullableNum,
  bool,
  isPopulated,
  toIdList,
} from "../../../src/server/mappers/primitives";

describe("id", () => {
  it("returns string for a string value", () => {
    expect(id("abc123")).toBe("abc123");
  });

  it("returns empty string for null", () => {
    expect(id(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(id(undefined)).toBe("");
  });

  it("returns string representation of a number", () => {
    expect(id(42)).toBe("42");
  });

  it("returns string representation of an ObjectId-like string", () => {
    expect(id("507f1f77bcf86cd799439011")).toBe("507f1f77bcf86cd799439011");
  });
});

describe("str", () => {
  it("returns the string value unchanged", () => {
    expect(str("hello")).toBe("hello");
  });

  it("returns empty string for null", () => {
    expect(str(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(str(undefined)).toBe("");
  });

  it("returns empty string for a number", () => {
    expect(str(42)).toBe("");
  });

  it("returns empty string for an object", () => {
    expect(str({})).toBe("");
  });
});

describe("nullableStr", () => {
  it("returns the string for a non-empty string", () => {
    expect(nullableStr("hello")).toBe("hello");
  });

  it("returns null for an empty string", () => {
    expect(nullableStr("")).toBe(null);
  });

  it("returns null for null", () => {
    expect(nullableStr(null)).toBe(null);
  });

  it("returns null for undefined", () => {
    expect(nullableStr(undefined)).toBe(null);
  });

  it("returns null for a number", () => {
    expect(nullableStr(42)).toBe(null);
  });
});

describe("num", () => {
  it("returns the number for a valid number", () => {
    expect(num(42)).toBe(42);
  });

  it("returns 0 for null", () => {
    expect(num(null)).toBe(0);
  });

  it("returns 0 for undefined", () => {
    expect(num(undefined)).toBe(0);
  });

  it("returns 0 for NaN", () => {
    expect(num(NaN)).toBe(0);
  });

  it("returns 0 for a string", () => {
    expect(num("42")).toBe(0);
  });

  it("returns 0 for Infinity", () => {
    expect(num(Infinity)).toBe(0);
  });

  it("returns 0 for -Infinity", () => {
    expect(num(-Infinity)).toBe(0);
  });

  it("returns 0 for an object", () => {
    expect(num({})).toBe(0);
  });
});

describe("nullableNum", () => {
  it("returns the number for a valid number", () => {
    expect(nullableNum(42)).toBe(42);
  });

  it("returns null for null", () => {
    expect(nullableNum(null)).toBe(null);
  });

  it("returns null for undefined", () => {
    expect(nullableNum(undefined)).toBe(null);
  });

  it("returns null for NaN", () => {
    expect(nullableNum(NaN)).toBe(null);
  });

  it("returns null for a string", () => {
    expect(nullableNum("42")).toBe(null);
  });
});

describe("bool", () => {
  it("returns true for true", () => {
    expect(bool(true)).toBe(true);
  });

  it("returns false for false", () => {
    expect(bool(false)).toBe(false);
  });

  it("returns false for null", () => {
    expect(bool(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(bool(undefined)).toBe(false);
  });

  it("returns false for a string", () => {
    expect(bool("true")).toBe(false);
  });

  it("returns false for a number", () => {
    expect(bool(1)).toBe(false);
  });

  it("returns false for an object", () => {
    expect(bool({})).toBe(false);
  });
});

describe("isPopulated", () => {
  it("returns true for a populated document with _id", () => {
    expect(isPopulated({ _id: "abc123", name: "test" })).toBe(true);
  });

  it("returns false for a plain string", () => {
    expect(isPopulated("abc123")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPopulated(null)).toBe(false);
  });

  it("returns false for an array", () => {
    expect(isPopulated(["abc"])).toBe(false);
  });

  it("returns false for an object without _id", () => {
    expect(isPopulated({ name: "test" })).toBe(false);
  });
});

describe("toIdList", () => {
  it("returns an array of ids from a populated array", () => {
    const result = toIdList([
      { _id: "aaa", name: "a" },
      { _id: "bbb", name: "b" },
    ]);
    expect(result).toEqual(["aaa", "bbb"]);
  });

  it("returns an array of ids from a string array", () => {
    const result = toIdList(["aaa", "bbb"]);
    expect(result).toEqual(["aaa", "bbb"]);
  });

  it("returns an array of ids from a mixed array", () => {
    const result = toIdList([
      { _id: "aaa", name: "a" },
      "bbb",
    ]);
    expect(result).toEqual(["aaa", "bbb"]);
  });

  it("returns an empty array for an empty array", () => {
    expect(toIdList([])).toEqual([]);
  });

  it("returns an empty array when the value is not an array", () => {
    expect(toIdList(null)).toEqual([]);
    expect(toIdList(undefined)).toEqual([]);
    expect(toIdList("string")).toEqual([]);
  });

  it("filters out falsy id values", () => {
    const result = toIdList([
      { _id: "aaa", name: "a" },
      { _id: "", name: "b" },
    ]);
    expect(result).toEqual(["aaa"]);
  });
});
