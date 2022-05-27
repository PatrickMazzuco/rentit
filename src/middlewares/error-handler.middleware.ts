import { HttpException, HttpStatus } from "@src/errors";
import { NextFunction, Request, Response } from "express";

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

  console.log(error);

  return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
  });
};
