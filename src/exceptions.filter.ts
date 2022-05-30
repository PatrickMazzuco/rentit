/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ValidationError } from "class-validator";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      if (exception instanceof ValidationError) {
        const exceptionResponse: any = exception.getResponse();

        return response.status(status).json(exceptionResponse);
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      ["sandbox", "production", "development"].includes(process.env.NODE_ENV) &&
        console.log(exception);
    }

    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      process.env.NODE_ENV === "development"
    ) {
      return response.status(status).json({
        message: exception.message,
        stack: exception.stack,
      });
    }

    return response.status(status).json({
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? "Internal Server Error"
          : exception.message,
    });
  }
}
