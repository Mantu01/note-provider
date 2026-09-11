import { Counter } from "../db/models/counter.model";

export async function generateOrderNumber(now = new Date()): Promise<string> {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const key = `order:${datePart}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean().exec();

  if (!counter) {
    throw new Error(`Failed to generate order number for key: ${key}`);
  }

  const sequence = String(counter.seq).padStart(4, "0");
  return `NP-${datePart}-${sequence}`;
}
