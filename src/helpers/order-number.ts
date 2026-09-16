import { prisma } from "./db";

export async function generateOrderNumber(now = new Date()): Promise<string> {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const counter = await prisma.counter.upsert({
    where: { key: `order:${datePart}` },
    create: { key: `order:${datePart}`, seq: 1 },
    update: { seq: { increment: 1 } },
  });
  const sequence = String(counter.seq).padStart(4, "0");
  return `NP-${datePart}-${sequence}`;
}
