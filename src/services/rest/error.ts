/**
 * Wraps Fetch response in a throwable error
 */
class ApiError extends Error {
  readonly response: Response;
  readonly status: number;
  readonly statusText: string;

  get isNotFound(): boolean {
    return this.status === 404;
  }

  constructor(response: Response) {
    const { status, statusText } = response;
    const message = `API Error with status ${status}: ${statusText}`;
    super(message);
    this.response = response;
    this.status = status;
    this.statusText = statusText;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
