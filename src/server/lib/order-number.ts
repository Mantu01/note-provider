import { Counter } from "../db/models/counter.model";

export async function generateOrderNumber(now = new Date()): Promise<string> {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const counter = await Counter.findOneAndUpdate(
    { key: `order:${datePart}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  const sequence = String(counter?.seq ?? 1).padStart(4, "0");
  return `NP-${datePart}-${sequence}`;
}
