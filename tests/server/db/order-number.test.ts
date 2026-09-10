import { describe, it, expect, vi } from "vitest";
import { generateOrderNumber } from "../../../src/server/lib/order-number";
import * as CounterModel from "../../../src/server/db/models/counter.model";

vi.mock("../../../src/server/db/models/counter.model", () => ({
  Counter: {
    findOneAndUpdate: vi.fn(),
  },
}));

describe("generateOrderNumber", () => {
  beforeEach(() => vi.clearAllMocks());

  it("generates order number with correct format", async () => {
    vi.mocked(CounterModel.Counter.findOneAndUpdate).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ seq: 1 }),
    } as any);

    const result = await generateOrderNumber(new Date("2024-06-15T10:00:00Z"));
    expect(result).toBe("NP-20240615-0001");
  });

  it("uses provided date parameter", async () => {
    vi.mocked(CounterModel.Counter.findOneAndUpdate).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ seq: 5 }),
    } as any);

    const result = await generateOrderNumber(new Date("2023-01-01T00:00:00Z"));
    expect(result).toBe("NP-20230101-0005");
  });

  it("handles counter returning undefined", async () => {
    vi.mocked(CounterModel.Counter.findOneAndUpdate).mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    } as any);

    const result = await generateOrderNumber(new Date("2024-01-01T00:00:00Z"));
    expect(result).toBe("NP-20240101-0001");
  });

  it("calls findOneAndUpdate with correct key", async () => {
    vi.mocked(CounterModel.Counter.findOneAndUpdate).mockReturnValue({
      lean: vi.fn().mockResolvedValue({ seq: 10 }),
    } as any);

    await generateOrderNumber(new Date("2024-03-15T12:00:00Z"));
    expect(CounterModel.Counter.findOneAndUpdate).toHaveBeenCalledWith(
      { key: "order:20240315" },
      { $inc: { seq: 1 } },
      expect.objectContaining({ upsert: true, new: true }),
    );
  });

  it("increments sequence number across calls", async () => {
    let seq = 10;
    vi.mocked(CounterModel.Counter.findOneAndUpdate).mockReturnValue({
      lean: vi.fn().mockImplementation(() => {
        return Promise.resolve({ seq: ++seq });
      }),
    } as any);

    const r1 = await generateOrderNumber(new Date("2024-01-01T00:00:00Z"));
    const r2 = await generateOrderNumber(new Date("2024-01-01T00:00:01Z"));

    expect(r1).toBe("NP-20240101-0011");
    expect(r2).toBe("NP-20240101-0012");
  });
});
