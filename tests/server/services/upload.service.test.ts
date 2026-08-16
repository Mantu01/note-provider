import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  uploadFile,
  deleteUpload,
} from "../../../src/server/services/upload.service";
import * as CloudinaryLib from "../../../src/server/lib/cloudinary";
import * as Errors from "../../../src/server/lib/errors";

vi.mock("../../../src/server/lib/cloudinary", () => ({
  uploadBuffer: vi.fn(),
  destroyAsset: vi.fn(),
}));

vi.mock("../../../src/server/lib/errors", () => ({
  AppError: {
    payloadTooLarge: vi.fn((msg: string) => new Error(msg)),
    unsupportedMediaType: vi.fn((msg: string) => new Error(msg)),
  },
}));

const originalEnv = { ...process.env };

describe("uploadFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;
    delete process.env.CLOUDINARY_API_SECRET;
  });

  afterEach(() => {
    Object.assign(process.env, originalEnv);
  });

  it("uploads a file successfully when cloudinary is configured", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.uploadBuffer).mockResolvedValue({
      url: "https://res.cloudinary.com/demo/upload/note.pdf",
      publicId: "notes/note.pdf",
      bytes: 100000,
      format: "pdf",
      pageCount: 10,
      resourceType: "auto",
    });

    const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    const result = await uploadFile(buffer, "note_full", "note.pdf");

    expect(CloudinaryLib.uploadBuffer).toHaveBeenCalledWith(
      expect.any(Buffer),
      expect.objectContaining({ folder: "notes-provider/notes/full", resourceType: "auto", deliveryType: "authenticated" }),
    );
    expect(result.url).toBe("https://res.cloudinary.com/demo/upload/note.pdf");
    expect(result.bytes).toBe(100000);
  });

  it("returns graceful fallback when cloudinary upload fails", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.uploadBuffer).mockRejectedValue(new Error("Network error"));

    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    const result = await uploadFile(buffer, "note_full", "note.pdf");

    expect(result.url).toContain("res.cloudinary.com/demo");
    expect(result.format).toBe("pdf");
    consoleWarn.mockRestore();
  });

  it("returns fallback when cloudinary is not configured", async () => {
    const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    const result = await uploadFile(buffer, "note_full", "note.pdf");

    expect(CloudinaryLib.uploadBuffer).not.toHaveBeenCalled();
    expect(result.url).toContain("res.cloudinary.com/demo");
    expect(result.format).toBe("pdf");
  });

  it("throws payload too large when buffer exceeds limit", async () => {
    (vi.mocked(Errors.AppError.payloadTooLarge) as any).mockImplementation((msg: string) => new Error(msg));

    const bigBuffer = Buffer.alloc(60 * 1024 * 1024 + 1);
    await expect(uploadFile(bigBuffer, "note_full", "big.pdf")).rejects.toThrow("exceeds");
  });

  it("throws unsupported media type for non-PDF note_full", async () => {
    (vi.mocked(Errors.AppError.unsupportedMediaType) as any).mockImplementation((msg: string) => new Error(msg));

    const buffer = Buffer.from("not a pdf");
    await expect(uploadFile(buffer, "note_full", "image.png")).rejects.toThrow("PDF files only");
  });

  it("throws unsupported media type for non-PDF note_preview", async () => {
    (vi.mocked(Errors.AppError.unsupportedMediaType) as any).mockImplementation((msg: string) => new Error(msg));

    const buffer = Buffer.from("not a pdf");
    await expect(uploadFile(buffer, "note_preview", "image.png")).rejects.toThrow("PDF files only");
  });

  it("allows image for cover kind", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.uploadBuffer).mockResolvedValue({
      url: "https://res.cloudinary.com/demo/image/upload/cover.jpg",
      publicId: "covers/cover.jpg",
      bytes: 50000,
      format: "jpg",
      pageCount: null,
      resourceType: "image",
    });

    const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const result = await uploadFile(buffer, "cover", "cover.jpg");

    expect(result.resourceType).toBe("image");
    expect(result.format).toBe("jpg");
    expect(result.pageCount).toBeNull();
  });

  it("accepts PDF by signature even without .pdf extension", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    (vi.mocked(Errors.AppError.unsupportedMediaType) as any).mockRestore();
    vi.mocked(CloudinaryLib.uploadBuffer).mockResolvedValue({
      url: "https://res.cloudinary.com/demo/upload/note",
      publicId: "notes/note",
      bytes: 100000,
      format: "pdf",
      pageCount: 1,
      resourceType: "auto",
    });

    const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const result = await uploadFile(buffer, "note_full", "note");

    expect(result.format).toBe("pdf");
  });

  it("uses authenticated delivery for note_full", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.uploadBuffer).mockResolvedValue({
      url: "https://res.cloudinary.com/demo/authenticated/note.pdf",
      publicId: "notes/note.pdf",
      bytes: 100000,
      format: "pdf",
      pageCount: 1,
      resourceType: "auto",
    });

    const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    await uploadFile(buffer, "note_full", "note.pdf");

    expect(CloudinaryLib.uploadBuffer).toHaveBeenCalledWith(
      expect.any(Buffer),
      expect.objectContaining({ deliveryType: "authenticated" }),
    );
  });

  it("uses upload delivery for note_preview", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.uploadBuffer).mockResolvedValue({
      url: "https://res.cloudinary.com/demo/upload/preview.pdf",
      publicId: "notes/preview.pdf",
      bytes: 50000,
      format: "pdf",
      pageCount: 1,
      resourceType: "auto",
    });

    const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
    await uploadFile(buffer, "note_preview", "preview.pdf");

    expect(CloudinaryLib.uploadBuffer).toHaveBeenCalledWith(
      expect.any(Buffer),
      expect.objectContaining({ deliveryType: "upload" }),
    );
  });

  it("normalizes bytes to minimum of 1024", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.uploadBuffer).mockResolvedValue({
      url: "https://res.cloudinary.com/demo/upload/small.pdf",
      publicId: "notes/small.pdf",
      bytes: 100,
      format: "pdf",
      pageCount: 1,
      resourceType: "auto",
    });

    const buffer = Buffer.alloc(50);
    const result = await uploadFile(buffer, "note_full", "small.pdf");

    expect(result.bytes).toBe(1024);
  });
});

describe("deleteUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes an asset when cloudinary is configured", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.destroyAsset).mockResolvedValue(undefined);

    await deleteUpload("notes/note.pdf", "auto");
    expect(CloudinaryLib.destroyAsset).toHaveBeenCalledWith("notes/note.pdf", "auto", "authenticated");
  });

  it("deletes an image asset with upload delivery type", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.destroyAsset).mockResolvedValue(undefined);

    await deleteUpload("covers/cover.jpg", "image");
    expect(CloudinaryLib.destroyAsset).toHaveBeenCalledWith("covers/cover.jpg", "image", "upload");
  });

  it("does nothing when cloudinary is not configured", async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;
    delete process.env.CLOUDINARY_API_SECRET;

    await deleteUpload("notes/note.pdf", "auto");
    expect(CloudinaryLib.destroyAsset).not.toHaveBeenCalled();
  });

  it("swallows errors without rethrowing", async () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";

    vi.mocked(CloudinaryLib.destroyAsset).mockRejectedValue(new Error("Delete failed"));

    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(deleteUpload("notes/note.pdf", "auto")).resolves.toBeUndefined();
    expect(consoleWarn).toHaveBeenCalledWith("[Cloudinary Delete Failed]:", expect.any(Error));
    consoleWarn.mockRestore();
  });
});
