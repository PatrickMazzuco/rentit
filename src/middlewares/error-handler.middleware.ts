import { HttpException, HttpStatus } from "@src/errors";
import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpException) {
    return response.status(error.status).json({
      message: error.message,
    });
  }

  if (error instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${request.path}:`, error.fields);
    return response.status(422).json({
      message: "Validation Failed",
      details: error?.fields,
    });
  }

  return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
  });
};
