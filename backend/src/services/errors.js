export class ApplicationError extends Error {
  constructor(httpCode, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError)
    }

    this.name = 'ApplicationError';
    // Custom debugging information
    this.httpCode = httpCode;
    this.date = new Date();
  }
}

export function sendError(res, status, message) {
  return res.status(status).json({
    error: message
  }).send();
}