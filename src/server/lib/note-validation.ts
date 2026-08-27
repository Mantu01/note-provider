import { Types } from "mongoose";
import { Note } from "../db/models/note.model";
import type { NoteDoc } from "../db/models/note.model";
import { AppError } from "./errors";

export async function validateNoteIdsExist(noteIds: string[]): Promise<void> {
  const trimmed = noteIds.filter((id) => id.trim());
  const uniqueIds = Array.from(new Set(trimmed));

  if (uniqueIds.length === 0) throw AppError.validation({ noteIds: "At least one note is required" });

  const existingNotes = await Note.find({ _id: { $in: uniqueIds } })
    .select("_id")
    .lean()
    .exec();
  const existingIds = new Set(existingNotes.map((n: Pick<NoteDoc, "_id">) => n._id.toString()));
  const missing = uniqueIds.filter((id) => !existingIds.has(id));
  if (missing.length > 0) throw AppError.notFound(`Note(s) ${missing.slice(0, 3).join(", ")} not found`);
}
