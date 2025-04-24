export class ApiError extends Error {
  constructor(
    public message: string,
    public code: string = "UNKNOWN_ERROR",
    public status: number = 500
  ) {
    super(message)
    this.name = "ApiError"
  }
}
