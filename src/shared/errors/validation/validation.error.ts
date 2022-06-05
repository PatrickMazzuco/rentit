/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from "@nestjs/common";

export class ValidationError extends BadRequestException {
  constructor(errors: any) {
    super({ message: "Error validating input data", errors });
  }
}
