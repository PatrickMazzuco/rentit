import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { UserRequest } from "@shared/dtos/user-request.dto";

import { AuthError } from "../errors/auth.errors";

@Injectable()
export class IsAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: UserRequest = context.switchToHttp().getRequest();

    const { isAdmin } = request.user;

    if (!isAdmin) {
      throw new AuthError.NoPermission();
    }

    return isAdmin;
  }
}
