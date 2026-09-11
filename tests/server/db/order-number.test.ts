import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateOrderNumber } from "../../../src/server/lib/order-number";
import { Counter } from "../../../src/server/db/models/counter.model";

vi.mock("../../../src/server/db/models/counter.model", () => ({
  Counter: {
    findOneAndUpdate: vi.fn(),
  },
}));

describe("generateOrderNumber", () => {
  const mockedCounter = vi.mocked(Counter);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates order number with correct format NP-YYYYMMDD-NNNN", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 42 }) }),
    } as any);

    const result = await generateOrderNumber();
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^NP-\d{8}-\d{4}$/);
  });

  it("uses today's date by default in YYYYMMDD format", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1 }) }),
    } as any);

    const now = new Date();
    const expected = now.toISOString().slice(0, 10).replace(/-/g, "");
    const result = await generateOrderNumber();
    expect(result).toContain(expected);
  });

  it("uses provided date parameter", async () => {
    const date = new Date("2024-06-15T00:00:00Z");
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1 }) }),
    } as any);

    const result = await generateOrderNumber(date);
    expect(result).toContain("20240615");
    expect(result).toBe("NP-20240615-0001");
  });

  it("pads sequence to 4 digits", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 5 }) }),
    } as any);

    const result = await generateOrderNumber(new Date("2024-01-01T00:00:00Z"));
    expect(result).toBe("NP-20240101-0005");
  });

  it("handles 4-digit sequence numbers without truncation", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1234 }) }),
    } as any);

    const result = await generateOrderNumber(new Date("2024-01-01T00:00:00Z"));
    expect(result).toBe("NP-20240101-1234");
  });

  it("handles large sequence numbers beyond 4 digits", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 10000 }) }),
    } as any);

    const result = await generateOrderNumber(new Date("2024-01-01T00:00:00Z"));
    expect(result).toBe("NP-20240101-10000");
  });

  it("throws when counter returns null", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) }),
    } as any);

    await expect(generateOrderNumber()).rejects.toThrow("Failed to generate order number");
  });

  it("throws when counter returns undefined", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(undefined) }),
    } as any);

    await expect(generateOrderNumber()).rejects.toThrow("Failed to generate order number");
  });

  it("calls findOneAndUpdate with correct key format", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 5 }) }),
    } as any);

    await generateOrderNumber();
    expect(mockedCounter.findOneAndUpdate).toHaveBeenCalledOnce();
    const callArgs = mockedCounter.findOneAndUpdate.mock.calls[0]!;
    expect((callArgs[0] as any).key).toMatch(/^order:\d{8}$/);
    expect(callArgs[1]).toEqual({ $inc: { seq: 1 } });
    expect(callArgs[2]).toEqual({ upsert: true, new: true, setDefaultsOnInsert: true });
  });

  it("uses the correct date part in the counter key", async () => {
    const date = new Date("2025-03-25T00:00:00Z");
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1 }) }),
    } as any);

    await generateOrderNumber(date);
    const callArgs = mockedCounter.findOneAndUpdate.mock.calls[0]!;
    expect((callArgs[0] as any).key).toBe("order:20250325");
  });

  it("increments sequence number across calls", async () => {
    let seq = 0;
    mockedCounter.findOneAndUpdate.mockImplementation(() => {
      seq++;
      return {
        lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq }) }),
      } as any;
    });

    const date = new Date("2024-01-01T00:00:00Z");
    const n1 = await generateOrderNumber(date);
    const n2 = await generateOrderNumber(date);
    const parts1 = n1.split("-");
    const parts2 = n2.split("-");
    expect(Number(parts2[2])).toBeGreaterThan(Number(parts1[2]));
  });

  it("generates unique order numbers for different dates", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1 }) }),
    } as any);

    const d1 = new Date("2024-01-01T00:00:00Z");
    const d2 = new Date("2024-01-02T00:00:00Z");
    const n1 = await generateOrderNumber(d1);
    const n2 = await generateOrderNumber(d2);
    expect(n1).not.toBe(n2);
    expect(n1).toContain("20240101");
    expect(n2).toContain("20240102");
  });

  it("throws propagated error when findOneAndUpdate rejects", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockRejectedValue(new Error("DB connection lost")) }),
    } as any);

    await expect(generateOrderNumber()).rejects.toThrow("DB connection lost");
  });

  it("generates order number with seq=1 for first order of the day", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1 }) }),
    } as any);

    const date = new Date("2026-09-11T00:00:00Z");
    const result = await generateOrderNumber(date);
    expect(result).toBe("NP-20260911-0001");
  });
});
