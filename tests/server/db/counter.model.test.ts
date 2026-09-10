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
    const counter = new Counter({ key: "order:20240101" });
    expect(counter.key).toBe("order:20240101");
    expect(counter.seq).toBe(0);
    expect(counter._id).toBeDefined();
  });
});
