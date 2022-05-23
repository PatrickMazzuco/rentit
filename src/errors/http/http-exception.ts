import { HttpStatus } from "./http-status.enum";

export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
  }
}
