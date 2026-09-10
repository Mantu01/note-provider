import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();

vi.mock("mongoose", () => ({
  default: { connect: mockConnect, disconnect: mockDisconnect },
  Types: { ObjectId: class ObjectId { toString() { return "mock-oid"; } } },
}));

const ConnectModule = await vi.importActual<typeof import("../../../src/server/db/connect")>(
  "../../../src/server/db/connect",
);

describe("connectDB — cache lifecycle", () => {
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
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("creates new connection when cache is empty", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    const result = await ConnectModule.connectDB();
    expect(mockConnect).toHaveBeenCalledTimes(1);
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
    expect(mockConnect).toHaveBeenCalledTimes(1);

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

  it("does not reconnect on second call after first failure", async () => {
    mockConnect.mockRejectedValueOnce(new Error("fail"));
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    await ConnectModule.connectDB().catch(() => {});
    expect(cached.promise).toBeNull();

    const result = await ConnectModule.connectDB();
    expect(result.connection.readyState).toBe(1);
  });

  it("passes correct mongoose options", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    await ConnectModule.connectDB();
    const opts = mockConnect.mock.calls[0][1];
    expect(opts.bufferCommands).toBe(true);
    expect(opts.maxPoolSize).toBe(10);
    expect(opts.serverSelectionTimeoutMS).toBe(10000);
    expect(opts.connectTimeoutMS).toBe(10000);
    expect(opts.socketTimeoutMS).toBe(20000);
  });

  it("falls back to localhost when MONGODB_URI is not set", async () => {
    const original = process.env.MONGODB_URI;
    delete (process.env as any).MONGODB_URI;
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    vi.resetModules();
    const mod = await import("../../../src/server/db/connect");
    await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost:27017", expect.any(Object));

    if (original !== undefined) {
      (process.env as any).MONGODB_URI = original;
    } else {
      delete (process.env as any).MONGODB_URI;
    }
  });
});

describe("connectDB — edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const cached = (globalThis as any).mongoose;
    if (cached) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  it("returns immediately when conn exists but promise is stale", async () => {
    const cached = (globalThis as any).mongoose;
    cached.conn = { connection: { readyState: 1 } };
    cached.promise = Promise.resolve(null) as any;

    const result = await ConnectModule.connectDB();
    expect(result.connection.readyState).toBe(1);
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("handles multiple rapid sequential calls without re-connecting", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    const results = await Promise.all([
      ConnectModule.connectDB(),
      ConnectModule.connectDB(),
      ConnectModule.connectDB(),
    ]);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    results.forEach((r) => expect(r.connection.readyState).toBe(1));
  });

  it("recovers from ECONNREFUSED-style error", async () => {
    const err = new Error("ECONNREFUSED 127.0.0.1:27017");
    (err as NodeJS.ErrnoException).code = "ECONNREFUSED";
    mockConnect.mockRejectedValue(err);
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    await expect(ConnectModule.connectDB()).rejects.toThrow("ECONNREFUSED");
    expect(cached.promise).toBeNull();
  });

  it("uses custom MONGODB_URI from env", async () => {
    (process.env as any).MONGODB_URI = "mongodb://custom-host:27017/testdb";
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const cached = (globalThis as any).mongoose;
    cached.conn = null;
    cached.promise = null;

    // Reset module cache to pick up new env var
    vi.resetModules();
    const mod = await import("../../../src/server/db/connect");
    await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://custom-host:27017/testdb", expect.any(Object));

    delete (process.env as any).MONGODB_URI;
  });
});
