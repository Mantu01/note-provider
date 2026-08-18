import { Types } from "mongoose";
import { Note } from "../db/models/note.model";
import { AppError } from "./errors";

export async function validateNoteIdsExist(noteIds: string[]): Promise<void> {
  const trimmed = noteIds.filter((id) => id.trim());
  const uniqueIds = Array.from(new Set(trimmed));

  if (uniqueIds.length === 0) throw AppError.validation({ noteIds: "At least one note is required" });

  const existingNotes = await (Note as any).find({ _id: { $in: uniqueIds.map((id) => new Types.ObjectId(id)) } }).select("_id").lean().exec();
  const existingIds = existingNotes.map((n: { _id: import("mongoose").Types.ObjectId }) => n._id.toString());
  const missing = uniqueIds.filter((id) => !existingIds.includes(id));
  if (missing.length > 0) throw AppError.notFound(`Note(s) ${missing.slice(0, 3).join(", ")} not found`);
}
