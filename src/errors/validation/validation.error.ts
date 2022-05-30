/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from "@nestjs/common";

export class ValidationError extends BadRequestException {
  constructor(errors: any) {
    super({ message: "Erro na validação dos dados de entrada", errors });
  }
}
