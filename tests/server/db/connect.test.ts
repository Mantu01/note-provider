import { describe, it, expect, vi, beforeEach } from "vitest";

const mockConnect = vi.fn();

vi.mock("mongoose", () => ({
  default: { connect: mockConnect },
}));

const ConnectModule = await vi.importActual<typeof import("../../../src/server/db/connect")>(
  "../../../src/server/db/connect",
);

describe("connectDB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const cached = (globalThis as any).mongoose;
    if (cached) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  it("returns cached connection when already connected", async () => {
    const mockConn = { connection: { readyState: 1 } };
    const cached = (globalThis as any).mongoose;
    cached.conn = mockConn;

    const result = await ConnectModule.connectDB();
    expect(result).toBe(mockConn);
  });

  it("creates new connection when cache is empty", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    const result = await ConnectModule.connectDB();
    expect(mockConnect).toHaveBeenCalledOnce();
    expect(result.connection.readyState).toBe(1);
  });

  it("shares promise between concurrent calls", async () => {
    let resolver: ((value: any) => void) | null = null;
    mockConnect.mockImplementation(
      () => new Promise((resolve) => { resolver = resolve; })
    );
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    const p1 = ConnectModule.connectDB();
    const p2 = ConnectModule.connectDB();
    expect(mockConnect).toHaveBeenCalledOnce();

    resolver!({ connection: { readyState: 1 } });
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(r2);
  });

  it("resets promise on connection failure and allows retry", async () => {
    const err = new Error("Connection failed");
    mockConnect.mockRejectedValue(err);
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    await expect(ConnectModule.connectDB()).rejects.toThrow("Connection failed");
    expect(cached.promise).toBeNull();
  });
});
