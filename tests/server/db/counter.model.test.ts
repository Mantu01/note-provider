import { describe, it, expect } from "vitest";
import { Counter } from "../../../src/server/db/models/counter.model";

describe("Counter model — schema structure", () => {
  it("key is required, unique, and indexed", () => {
    const keyPath = Counter.schema.path("key") as any;
    expect(keyPath.isRequired).toBe(true);
    expect(keyPath.options.unique).toBe(true);
    expect(keyPath.options.index).toBe(true);
  });

  it("seq is required and defaults to 0", () => {
    const seqPath = Counter.schema.path("seq") as any;
    expect(seqPath.isRequired).toBe(true);
    expect(seqPath.defaultValue).toBe(0);
  });

  it("does not have timestamps", () => {
    expect(Counter.schema.options.timestamps).toBeUndefined();
  });

  it("has at least one index defined", () => {
    const indexes = Counter.schema.indexes();
    expect(indexes.length).toBeGreaterThan(0);
  });

  it("key is a String type", () => {
    const keyPath = Counter.schema.path("key") as any;
    expect(keyPath.instance).toBe("String");
  });

  it("seq is a Number type", () => {
    const seqPath = Counter.schema.path("seq") as any;
    expect(seqPath.instance).toBe("Number");
  });
});

describe("Counter model — document instantiation", () => {
  it("creates counter with key and default seq of 0", async () => {
    const counter = new Counter({ key: "test" });
    expect(counter.key).toBe("test");
    expect(counter.seq).toBe(0);
  });

  it("auto-generates _id", async () => {
    const counter = new Counter({ key: "order:20240101" });
    expect(counter._id).toBeDefined();
  });

  it("seq defaults to 0, not undefined", async () => {
    const counter = new Counter({ key: "test-key" });
    expect(counter.seq).toBe(0);
    expect(typeof counter.seq).toBe("number");
  });

  it("accepts order-number style keys like order:YYYYMMDD", async () => {
    const counter = new Counter({ key: "order:20240101" });
    expect(counter.key).toBe("order:20240101");
  });

  it("accepts arbitrary string keys", async () => {
    const counter = new Counter({ key: "any:arbitrary:key:here" });
    expect(counter.key).toBe("any:arbitrary:key:here");
  });

  it("accepts explicit seq value", async () => {
    const counter = new Counter({ key: "inc-test", seq: 5 });
    expect(counter.seq).toBe(5);
  });

  it("allows multiple instances with same key (uniqueness enforced at DB level)", async () => {
    const c1 = new Counter({ key: "dup-key" });
    const c2 = new Counter({ key: "dup-key", seq: 1 });
    expect(c1.key).toBe(c2.key);
    expect(c2.seq).toBe(1);
  });

  it("two separate instances have different _ids", () => {
    const c1 = new Counter({ key: "a" });
    const c2 = new Counter({ key: "b" });
    expect(c1._id.toString()).not.toBe(c2._id.toString());
  });
});

describe("Counter model — validation", () => {
  it("rejects missing key", async () => {
    const counter = new Counter({} as any);
    await expect(counter.validate()).rejects.toThrow();
  });

  it("rejects empty string key", async () => {
    const counter = new Counter({ key: "", seq: 0 } as any);
    await expect(counter.validate()).rejects.toThrow();
  });

  it("passes validation with valid key", async () => {
    const counter = new Counter({ key: "test-key" });
    await expect(counter.validate()).resolves.toBeUndefined();
  });

  it("allows incrementing seq without validation error", async () => {
    const counter = new Counter({ key: "inc-test", seq: 5 });
    expect(counter.seq).toBe(5);
    counter.seq = 6;
    await expect(counter.validate()).resolves.toBeUndefined();
  });

  it("allows seq to be any non-negative number", async () => {
    const counter = new Counter({ key: "large-seq", seq: 9999 });
    await expect(counter.validate()).resolves.toBeUndefined();
  });

  it("allows seq to remain at 0", async () => {
    const counter = new Counter({ key: "zero-seq", seq: 0 });
    await expect(counter.validate()).resolves.toBeUndefined();
  });

  it("validates both key and seq are present", async () => {
    const counter = new Counter({ key: "full-counter", seq: 42 });
    await expect(counter.validate()).resolves.toBeUndefined();
    expect(counter.key).toBe("full-counter");
    expect(counter.seq).toBe(42);
  });
});
