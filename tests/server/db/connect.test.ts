import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockConnectionState = { readyState: 0 };

vi.mock("mongoose", () => ({
  default: {
    connect: mockConnect,
    disconnect: mockDisconnect,
    connection: mockConnectionState,
  },
  Types: {
    ObjectId: class ObjectId {
      toString() {
        return "mock-oid";
      }
    },
  },
}));

async function freshImport() {
  vi.resetModules();
  return import("../../../src/server/db/connect");
}

function resetCache() {
  if ((globalThis as any).__mongooseCache) {
    (globalThis as any).__mongooseCache.conn = null;
    (globalThis as any).__mongooseCache.promise = null;
  }
}

describe("connectDB — cache lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCache();
    mockConnectionState.readyState = 1;
  });

  it("returns cached connection when already connected", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    await mod.connectDB();
    vi.clearAllMocks();

    const mockConn = { connection: { readyState: 1 } };
    const cache = (globalThis as any).__mongooseCache;
    cache.conn = mockConn;
    cache.promise = null;
    mockConnectionState.readyState = 1;

    const result = await mod.connectDB();
    expect(result).toBe(mockConn);
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("creates new connection when cache is empty", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();

    const result = await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it("shares promise between concurrent calls", async () => {
    let resolver: ((value: any) => void) | null = null;
    mockConnect.mockImplementation(
      () => new Promise((resolve) => { resolver = resolve; })
    );
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 2;

    const p1 = mod.connectDB();
    const p2 = mod.connectDB();
    expect(mockConnect).toHaveBeenCalledTimes(1);

    mockConnectionState.readyState = 1;
    resolver!({ connection: { readyState: 1 } });
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(r2);
  });

  it("resets promise on connection failure and allows retry", async () => {
    const err = new Error("Connection failed");
    mockConnect.mockRejectedValue(err);
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    await expect(mod.connectDB()).rejects.toThrow("Connection failed");
    const cache = (globalThis as any).__mongooseCache;
    expect(cache.promise).toBeNull();
    expect(cache.conn).toBeNull();
  });

  it("retries connection after first failure", async () => {
    mockConnect.mockRejectedValueOnce(new Error("fail"));
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    await mod.connectDB().catch(() => {});
    const cache = (globalThis as any).__mongooseCache;
    expect(cache.promise).toBeNull();

    mockConnectionState.readyState = 1;
    const result = await mod.connectDB();
    expect(result).toBeDefined();
  });

  it("passes correct mongoose options", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();

    await mod.connectDB();
    const opts = mockConnect.mock.calls[0][1];
    expect(opts.bufferCommands).toBe(false);
    expect(opts.maxPoolSize).toBe(10);
    expect(opts.minPoolSize).toBe(1);
    expect(opts.serverSelectionTimeoutMS).toBe(10000);
    expect(opts.connectTimeoutMS).toBe(10000);
    expect(opts.socketTimeoutMS).toBe(45000);
    expect(opts.heartbeatFrequencyMS).toBe(10000);
    expect(opts.retryWrites).toBe(true);
    expect(opts.retryReads).toBe(true);
    expect(opts.w).toBe("majority");
  });
});

describe("connectDB — URI resolution", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCache();
    mockConnectionState.readyState = 1;
  });

  it("uses MONGODB_URI from environment", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    vi.stubEnv("MONGODB_URI", "mongodb://custom-host:27017/testdb");
    const mod = await freshImport();
    resetCache();

    await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://custom-host:27017/testdb", expect.any(Object));

    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");
  });

  it("falls back to localhost when MONGODB_URI is empty string", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    vi.stubEnv("MONGODB_URI", "");
    const mod = await freshImport();
    resetCache();

    await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost:27017", expect.any(Object));

    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");
  });

  it("falls back to localhost when MONGODB_URI is whitespace only", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    vi.stubEnv("MONGODB_URI", "   ");
    const mod = await freshImport();
    resetCache();

    await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost:27017", expect.any(Object));

    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");
  });

  it("trims whitespace from MONGODB_URI", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    vi.stubEnv("MONGODB_URI", "  mongodb://trimmed-host:27017/db  ");
    const mod = await freshImport();
    resetCache();

    await mod.connectDB();
    expect(mockConnect).toHaveBeenCalledWith("mongodb://trimmed-host:27017/db", expect.any(Object));

    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");
  });

  it("getMongoUri returns correct URI from env", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb://env-host:27017/mydb");
    const mod = await freshImport();
    expect(mod.getMongoUri()).toBe("mongodb://env-host:27017/mydb");
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");
  });

  it("getMongoUri returns localhost when env is empty", async () => {
    vi.stubEnv("MONGODB_URI", "");
    const mod = await freshImport();
    expect(mod.getMongoUri()).toBe("mongodb://localhost:27017");
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017/notes-provider-test");
  });
});

describe("connectDB — stale connection recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCache();
  });

  it("reconnects when cached connection is dead (readyState=0)", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();

    const staleConn = { connection: { readyState: 0 } };
    const cache = (globalThis as any).__mongooseCache;
    cache.conn = staleConn;
    mockConnectionState.readyState = 0;

    await mod.connectDB();

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it("reconnects when cached connection is in disconnecting state (readyState=3)", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();

    const staleConn = { connection: { readyState: 3 } };
    const cache = (globalThis as any).__mongooseCache;
    cache.conn = staleConn;
    mockConnectionState.readyState = 3;

    await mod.connectDB();

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it("does not reconnect when connection is connecting (readyState=2)", async () => {
    const mod = await freshImport();
    resetCache();

    const connectingConn = { connection: { readyState: 2 } };
    const cache = (globalThis as any).__mongooseCache;
    cache.conn = connectingConn;
    mockConnectionState.readyState = 2;

    const result = await mod.connectDB();

    expect(mockConnect).not.toHaveBeenCalled();
    expect(result).toBe(connectingConn);
  });

  it("resets conn and promise on dead connection before reconnect", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();

    const staleConn = {} as any;
    const cache = (globalThis as any).__mongooseCache;
    cache.conn = staleConn;
    cache.promise = Promise.resolve(staleConn);
    mockConnectionState.readyState = 0;

    await mod.connectDB();

    expect(cache.conn).not.toBe(staleConn);
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});

describe("connectDB — edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCache();
    mockConnectionState.readyState = 1;
  });

  it("returns immediately when conn exists but promise is stale", async () => {
    const mod = await freshImport();
    const conn = { connection: { readyState: 1 } };
    const cache = (globalThis as any).__mongooseCache;
    cache.conn = conn;
    cache.promise = Promise.resolve(null) as any;
    mockConnectionState.readyState = 1;

    const result = await mod.connectDB();
    expect(result).toBe(conn);
    expect(mockConnect).not.toHaveBeenCalled();
  });

  it("handles multiple rapid concurrent calls without re-connecting", async () => {
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    const [, r2, r3] = await Promise.all([
      (async () => {
        mockConnectionState.readyState = 1;
        return mod.connectDB();
      })(),
      mod.connectDB(),
      mod.connectDB(),
    ]);

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(r2).toBeDefined();
    expect(r3).toBeDefined();
  });

  it("recovers from ECONNREFUSED-style error", async () => {
    const err = new Error("ECONNREFUSED 127.0.0.1:27017");
    (err as NodeJS.ErrnoException).code = "ECONNREFUSED";
    mockConnect.mockRejectedValue(err);
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    await expect(mod.connectDB()).rejects.toThrow("ECONNREFUSED");
    const cache = (globalThis as any).__mongooseCache;
    expect(cache.promise).toBeNull();
  });

  it("recovers from server selection timeout error", async () => {
    const err = new Error("Server selection timed out after 10000 ms");
    mockConnect.mockRejectedValue(err);
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    await expect(mod.connectDB()).rejects.toThrow("Server selection timed out");
    const cache = (globalThis as any).__mongooseCache;
    expect(cache.promise).toBeNull();
    expect(cache.conn).toBeNull();
  });

  it("recovers from network timeout and retries successfully", async () => {
    mockConnect
      .mockRejectedValueOnce(new Error("network timeout"))
      .mockResolvedValue({ connection: { readyState: 1 } });
    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    await expect(mod.connectDB()).rejects.toThrow("network timeout");

    mockConnectionState.readyState = 1;
    const result = await mod.connectDB();
    expect(result).toBeDefined();
    expect(mockConnect).toHaveBeenCalledTimes(2);
  });

  it("global cache is initialized on first access", async () => {
    delete (globalThis as any).__mongooseCache;
    const mod = await freshImport();
    mockConnect.mockResolvedValue({ connection: { readyState: 1 } });
    mockConnectionState.readyState = 0;

    await mod.connectDB();
    mockConnectionState.readyState = 1;

    expect((globalThis as any).__mongooseCache).toBeDefined();
    expect((globalThis as any).__mongooseCache.conn).toBeDefined();
  });

  it("does not overwrite an existing active cached connection on concurrent requests", async () => {
    let resolveFirst: ((v: any) => void) | null = null;
    let callCount = 0;
    mockConnect.mockImplementation(() => {
      callCount++;
      return new Promise((resolve) => { resolveFirst = resolve; });
    });

    const mod = await freshImport();
    resetCache();
    mockConnectionState.readyState = 0;

    const p1 = mod.connectDB();
    const p2 = mod.connectDB();
    const p3 = mod.connectDB();

    expect(callCount).toBe(1);

    mockConnectionState.readyState = 1;
    resolveFirst!({ connection: { readyState: 1 } });
    await Promise.all([p1, p2, p3]);

    expect(callCount).toBe(1);
  });
});

describe("connectDB — MongooseCache type export", () => {
  it("exports MongooseCache type (conn/promise structure)", async () => {
    const mod = await freshImport();
    expect(typeof mod.connectDB).toBe("function");
    expect(typeof mod.getMongoUri).toBe("function");
  });
});
