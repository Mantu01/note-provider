import { adminHandler } from "@/server/lib/api-handler";
import { ok } from "@/server/lib/api-response";
import { AppError } from "@/server/lib/errors";
import { uploadFile, deleteUpload } from "@/server/services/upload.service";
import { UPLOAD_LIMITS } from "@/lib/constants";
import type { UploadKind } from "@/lib/types";

export const runtime = "nodejs";

export const POST = adminHandler(async (ctx) => {
  try {
    const formData = await ctx.req.formData();
    const file = formData.get("file") as File | null;
    const kind = formData.get("kind") as string;

    console.log(`[API /admin/uploads] Incoming upload: filename="${file?.name}", size=${file?.size} bytes, kind="${kind}"`);

    if (!file) throw AppError.validation({ file: "File is required" });
    if (!kind || !(kind in UPLOAD_LIMITS)) throw AppError.validation({ kind: "Invalid upload kind" });

    const buffer = Buffer.from(await file.arrayBuffer());
    const limit = UPLOAD_LIMITS[kind as UploadKind];

    if (buffer.length > limit.maxBytes) {
      throw AppError.payloadTooLarge(`File exceeds ${limit.maxBytes / 1024 / 1024} MB limit`);
    }

    const result = await uploadFile(buffer, kind as UploadKind, file.name);
    console.log(`[API /admin/uploads] SUCCESS: fileUrl="${result.url}", publicId="${result.publicId}"`);
    return ok(result);
  } catch (err: any) {
    console.error("[API /admin/uploads ERROR]:", err);
    throw err;
  }
});

export const DELETE = adminHandler(async (ctx) => {
  if (!ctx.admin.isHead) {
    throw AppError.forbidden("Only head admin can perform delete operations");
  }

  try {
    const body = await ctx.req.json();
    const { publicId, resourceType } = body;

    if (!publicId || !resourceType) throw AppError.validation({ publicId: "Required" });

    await deleteUpload(publicId, resourceType as "auto" | "image");
    return ok({ deleted: true });
  } catch (err: any) {
    console.error("[API /admin/uploads DELETE ERROR]:", err);
    throw err;
  }
});
