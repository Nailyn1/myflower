export abstract class ApiError extends Error {
  abstract statusCode: number;
  isOperational: boolean;

  protected constructor(message: string, isOperational = true) {
    super(message);
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  statusCode = 400;

  constructor(message = "Invalid request") {
    super(message);
  }
}

export class NotFoundError extends ApiError {
  statusCode = 404;

  constructor(message = "The resource was not found") {
    super(message);
  }
}

export class ConflictError extends ApiError {
  statusCode = 409;

  constructor(message = "Data conflict") {
    super(message);
  }
}
