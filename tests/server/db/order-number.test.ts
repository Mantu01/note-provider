import { describe, it, expect, vi } from "vitest";
import { generateOrderNumber } from "../../../src/server/lib/order-number";
import { Counter } from "../../../src/server/db/models/counter.model";

vi.mock("../../../src/server/db/models/counter.model", () => ({
  Counter: {
    findOneAndUpdate: vi.fn(),
  },
}));

describe("generateOrderNumber", () => {
  const mockedCounter = vi.mocked(Counter);

  it("generates order number with correct format", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 42 }) }),
    } as any);

    const result = await generateOrderNumber();
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^NP-\d{8}-\d{4}$/);
  });

  it("uses provided date parameter", async () => {
    const date = new Date("2024-06-15T00:00:00Z");
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 1 }) }),
    } as any);

    const result = await generateOrderNumber(date);
    expect(result).toContain("20240615");
  });

  it("falls back to 0001 when counter returns undefined", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(undefined) }),
    } as any);

    const result = await generateOrderNumber();
    expect(result).toMatch(/^NP-\d{8}-0001$/);
  });

  it("calls findOneAndUpdate with correct key", async () => {
    mockedCounter.findOneAndUpdate.mockReturnValue({
      lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq: 5 }) }),
    } as any);

    await generateOrderNumber();
    expect(mockedCounter.findOneAndUpdate).toHaveBeenCalledOnce();
    const callArgs = mockedCounter.findOneAndUpdate.mock.calls[0]!;
    expect((callArgs[0] as any).key).toMatch(/^order:/);
    expect(callArgs[1]).toEqual({ $inc: { seq: 1 } });
    expect(callArgs[2]).toEqual({ upsert: true, new: true, setDefaultsOnInsert: true });
  });

  it("increments sequence number across calls", async () => {
    let seq = 0;
    mockedCounter.findOneAndUpdate.mockImplementation(() => {
      seq++;
      return {
        lean: vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ seq }) }),
      } as any;
    });

    const n1 = await generateOrderNumber();
    const n2 = await generateOrderNumber();
    const parts1 = n1.split("-");
    const parts2 = n2.split("-");
    expect(Number(parts2[2])).toBeGreaterThan(Number(parts1[2]));
  });
});
