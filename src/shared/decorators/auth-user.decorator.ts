import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserRequest } from "@shared/dtos/user-request.dto";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: UserRequest = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
