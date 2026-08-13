import { ERROR_STATUS } from "@/lib/constants";
import type { ErrorCode } from "@/lib/types";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(code: ErrorCode, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = ERROR_STATUS[code];
    this.fields = fields;
  }

  static validation(fields?: Record<string, string>, message = "Please check the highlighted fields") {
    return new AppError("VALIDATION_ERROR", message, fields);
  }

  static unauthorized(message = "Your session has expired. Please log in again.") {
    return new AppError("UNAUTHORIZED", message);
  }

  static forbidden(message = "You are not allowed to perform this action.") {
    return new AppError("FORBIDDEN", message);
  }

  static notFound(entity = "Resource") {
    return new AppError("NOT_FOUND", `${entity} not found`);
  }

  static conflict(message: string) {
    return new AppError("CONFLICT", message);
  }

  static payment(message = "Payment could not be processed. Please try again.") {
    return new AppError("PAYMENT_ERROR", message);
  }

  static rateLimited(message = "Too many attempts. Please try again in a few minutes.") {
    return new AppError("RATE_LIMITED", message);
  }

  static payloadTooLarge(message: string) {
    return new AppError("PAYLOAD_TOO_LARGE", message);
  }

  static unsupportedMediaType(message: string) {
    return new AppError("UNSUPPORTED_MEDIA_TYPE", message);
  }

  static internal(message = "Something went wrong. Please try again.") {
    return new AppError("INTERNAL_ERROR", message);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

type MongoDuplicateKeyError = { code: number; keyPattern?: Record<string, unknown> };

export function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

export function duplicateKeyToAppError(error: MongoDuplicateKeyError): AppError {
  const field = Object.keys(error.keyPattern ?? {})[0] ?? "value";
  const labels: Record<string, string> = {
    slug: "An item with this title already exists",
    email: "An account with this email already exists",
    name: "An item with this name already exists",
    orderNumber: "Duplicate order number, please retry",
    razorpayOrderId: "This payment order already exists",
  };
  return AppError.conflict(labels[field] ?? `Duplicate value for ${field}`);
}
