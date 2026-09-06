export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  constructor(public readonly code: AppErrorCode, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export function toSafeActionError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  console.error(error);
  return new AppError("INTERNAL_SERVER_ERROR", "Something went wrong. Please try again.");
}
