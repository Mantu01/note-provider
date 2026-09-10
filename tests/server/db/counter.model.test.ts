import { describe, it, expect } from "vitest";
import { Counter } from "../../../src/server/db/models/counter.model";

describe("Counter model", () => {
  it("has required key field with unique index", () => {
    const keyPath = Counter.schema.path("key") as any;
    expect(keyPath.isRequired).toBe(true);
    expect(keyPath.options.unique).toBe(true);
    expect(keyPath.options.index).toBe(true);
  });

  it("has seq field defaulting to 0", () => {
    const seqPath = Counter.schema.path("seq") as any;
    expect(seqPath.isRequired).toBe(true);
    expect(seqPath.defaultValue).toBe(0);
  });

  it("creates a valid counter document", async () => {
    const counter = new Counter({ key: "test" });
    expect(counter.key).toBe("test");
    expect(counter.seq).toBe(0);
  });

  it("requires key field", async () => {
    const counter = new Counter({} as any);
    await expect(counter.validate()).rejects.toThrow();
  });

  it("has _id auto-generated", async () => {
    const counter = new Counter({ key: "order:20240101" });
    expect(counter._id).toBeDefined();
  });

  it("seq defaults to 0 not undefined", async () => {
    const counter = new Counter({ key: "test-key" });
    expect(counter.seq).toBe(0);
    expect(typeof counter.seq).toBe("number");
  });

  it("does not have timestamps", async () => {
    expect(Counter.schema.options.timestamps).toBeUndefined();
  });

  it("supports order-number style keys", async () => {
    const counter = new Counter({ key: "order:20240101" });
    expect(counter.key).toBe("order:20240101");
  });

  it("increments seq without validation error", async () => {
    const counter = new Counter({ key: "inc-test", seq: 5 });
    expect(counter.seq).toBe(5);
    counter.seq = 6;
    await expect(counter.validate()).resolves.toBeUndefined();
  });

  it("allows repeated instantiation without DB error", async () => {
    const c1 = new Counter({ key: "dup-key" });
    const c2 = new Counter({ key: "dup-key", seq: 1 });
    expect(c1.key).toBe(c2.key);
    expect(c2.seq).toBe(1);
  });

  it("rejects empty string key", async () => {
    const counter = new Counter({ key: "", seq: 0 } as any);
    await expect(counter.validate()).rejects.toThrow();
  });

  it("has an index defined", () => {
    const indexes = Counter.schema.indexes();
    expect(indexes.length).toBeGreaterThan(0);
  });
});
