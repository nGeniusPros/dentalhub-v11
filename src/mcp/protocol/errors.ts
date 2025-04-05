export class MCPError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'MCPError';
    Object.setPrototypeOf(this, MCPError.prototype);
  }
}
