/* eslint-disable @typescript-eslint/no-explicit-any */

import { ValidationPipe, ValidationPipeOptions } from "@nestjs/common";
import { ValidationError } from "class-validator";

import { ValidationError as CustomValidationErrors } from "./shared/errors/validation/validation.error";

const parseErrors = (error: ValidationError): any => {
  const parsedError = error.constraints
    ? {
        field: error.property,
        errors: Object.values(error.constraints),
      }
    : undefined;

  if (error.children.length === 0) {
    return parsedError;
  }

  const childrenErrors = error.children.map(parseErrors).flat();

  return parsedError ? [parsedError, ...childrenErrors] : childrenErrors;
};

export class ClassValidatorPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  exceptionFactory = (validationErrors: ValidationError[]): any => {
    console.log(validationErrors);

    if (validationErrors.length > 0) {
      const errors = validationErrors.map(parseErrors).flat();

      throw new CustomValidationErrors(errors);
    }
  };
}
