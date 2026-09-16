import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import { SIGNED_URL_TTL_SECONDS } from "@/lib/constants";
import { AppError } from "./errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryResourceType = "raw" | "image" | "auto";
export type CloudinaryDeliveryType = "upload" | "authenticated";

export type UploadResult = {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  pageCount: number | null;
  resourceType: CloudinaryResourceType;
};

export async function uploadBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    resourceType: CloudinaryResourceType;
    deliveryType: CloudinaryDeliveryType;
    filename: string;
  },
): Promise<UploadResult> {
  return new Promise<UploadResult>((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder: options.folder,
      resource_type: options.resourceType === "raw" ? "auto" : options.resourceType,
      use_filename: true,
      unique_filename: true,
      filename_override: options.filename,
      overwrite: false,
      ...(options.resourceType === "image"
        ? { transformation: [{ aspect_ratio: "16:9", crop: "fill" }] }
        : {}),
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          console.error("[Cloudinary upload_stream error]:", error);
          reject(AppError.internal(error?.message || "Cloudinary file upload failed."));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          format: result.format ?? "pdf",
          pageCount: typeof result.pages === "number" ? result.pages : null,
          resourceType: options.resourceType,
        });
      },
    );
    stream.end(buffer);
  });
}

export async function destroyAsset(
  publicId: string,
  resourceType: CloudinaryResourceType,
  deliveryType: CloudinaryDeliveryType = "upload",
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === "raw" ? "auto" : resourceType,
      type: deliveryType,
      invalidate: true,
    });
  } catch (error) {
    console.error("[cloudinary] destroy failed", publicId, error);
  }
}

export function buildSignedUrl(
  publicId: string,
  resourceType: CloudinaryResourceType = "auto",
  deliveryType: CloudinaryDeliveryType = "upload",
): string {
  return cloudinary.url(publicId, {
    resource_type: resourceType === "raw" ? "auto" : resourceType,
    type: deliveryType,
    secure: true,
  });
}
