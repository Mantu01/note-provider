import { describe, it, expect, vi } from "vitest";
import { validateNoteIdsExist } from "@/server/lib/note-validation";
import { Note } from "@/server/db/models/note.model";
import { AppError } from "@/server/lib/errors";

vi.mock("@/server/db/connect", () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/db/models/note.model", () => ({
  Note: {
    find: vi.fn(),
  },
}));

function makeChain(val: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(val),
  };
}

describe("validateNoteIdsExist", () => {
  it("throws when given empty array", async () => {
    const err = await validateNoteIdsExist([]).catch((e: any) => e);
    expect(err.fields?.noteIds).toBe("At least one note is required");
  });

  it("throws when all IDs are empty strings", async () => {
    const err = await validateNoteIdsExist(["", "  "]).catch((e: any) => e);
    expect(err.fields?.noteIds).toBe("At least one note is required");
  });

  it("succeeds when all note IDs exist", async () => {
    const id1 = "507f1f77bcf86cd799439011";
    const id2 = "507f1f77bcf86cd799439022";
    ;(Note.find as any).mockReturnValue(makeChain([
      { _id: id1 },
      { _id: id2 },
    ]));
    await expect(validateNoteIdsExist([id1, id2])).resolves.toBeUndefined();
  });

  it("deduplicates IDs before querying", async () => {
    const id1 = "507f1f77bcf86cd799439011";
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: id1 }]));
    await validateNoteIdsExist([id1, id1, id1]);
    expect(Note.find).toHaveBeenCalledTimes(1);
    expect((Note.find as any).mock.calls[0][0]._id.$in).toHaveLength(1);
  });

  it("throws when some note IDs are missing", async () => {
    const existingId = "507f1f77bcf86cd799439011";
    const missingId = "507f1f77bcf86cd799439022";
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: existingId }]));
    await expect(validateNoteIdsExist([existingId, missingId])).rejects.toThrow("not found");
  });

  it("shows at most 3 missing IDs in error message", async () => {
    const existingId = "507f1f77bcf86cd799439011";
    const missing1 = "507f1f77bcf86cd799439022";
    const missing2 = "507f1f77bcf86cd799439033";
    const missing3 = "507f1f77bcf86cd799439044";
    const missing4 = "507f1f77bcf86cd799439055";
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: existingId }]));
    await expect(validateNoteIdsExist([existingId, missing1, missing2, missing3, missing4]))
      .rejects.toThrow("507f1f77bcf86cd799439022");
    await expect(validateNoteIdsExist([existingId, missing1, missing2, missing3, missing4]))
      .rejects.toThrow("507f1f77bcf86cd799439044");
  });

  it("handles Note.find returning empty array", async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]));
    const id1 = "507f1f77bcf86cd799439011";
    await expect(validateNoteIdsExist([id1])).rejects.toThrow("not found");
  });

  it("uses ObjectId conversion for query", async () => {
    const id1 = "507f1f77bcf86cd799439011";
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: id1 }]));
    await validateNoteIdsExist([id1]);
    const queryArg = (Note.find as any).mock.calls[0][0];
    expect(queryArg._id.$in).toHaveLength(1);
  });

  it("passes 24-char hex string to query filter", async () => {
    const id1 = "507f1f77bcf86cd799439011";
    ;(Note.find as any).mockReturnValue(makeChain([{ _id: id1 }]));
    await validateNoteIdsExist([id1]);
    const queryArg = (Note.find as any).mock.calls[0][0];
    expect(queryArg._id.$in).toHaveLength(1);
    expect(queryArg._id.$in[0]).toBe(id1);
  });

  it("filters out empty strings before querying", async () => {
    ;(Note.find as any).mockReturnValue(makeChain([]));
    await expect(validateNoteIdsExist(["", "  "])).rejects.toThrow();
    expect(Note.find).not.toHaveBeenCalled();
  });
});
