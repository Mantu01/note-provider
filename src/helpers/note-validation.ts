import { prisma } from "./db";
import { AppError } from "./errors";

export async function validateNoteIdsExist(noteIds: string[]): Promise<void> {
  const trimmed = noteIds.filter((id) => id.trim());
  const uniqueIds = Array.from(new Set(trimmed));

  if (uniqueIds.length === 0) throw AppError.validation({ noteIds: "At least one note is required" });

  const existing = await prisma.note.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((n) => n.id));
  const missing = uniqueIds.filter((id) => !existingIds.has(id));
  if (missing.length > 0) throw AppError.notFound(`Note(s) ${missing.slice(0, 3).join(", ")} not found`);
}
