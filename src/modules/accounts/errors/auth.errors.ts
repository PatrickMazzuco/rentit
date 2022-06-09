import { ForbiddenException, UnauthorizedException } from "@nestjs/common";

import { AuthErrorMessage } from "./auth-error-messages.enum";

export namespace AuthError {
  export class Unauthorized extends UnauthorizedException {
    constructor() {
      const message = AuthErrorMessage.UNAUTHORIZED;
      super(message);
    }
  }

  export class InvalidCredentials extends UnauthorizedException {
    constructor() {
      const message = AuthErrorMessage.INVALID_CREDENTIALS;
      super(message);
    }
  }

  export class NoPermission extends ForbiddenException {
    constructor() {
      const message = AuthErrorMessage.INSUFFICIENT_PERMISSION;
      super(message);
    }
  }
}
