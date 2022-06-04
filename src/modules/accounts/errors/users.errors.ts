import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { UserErrorMessage } from "./users-error-messages.enum";

export namespace UserError {
  export class NotFound extends NotFoundException {
    constructor() {
      const message = UserErrorMessage.NOT_FOUND;
      super(message);
    }
  }

  export class AlreadyExists extends BadRequestException {
    constructor() {
      const message = UserErrorMessage.ALREADY_EXISTS;
      super(message);
    }
  }

  export class Unauthorized extends UnauthorizedException {
    constructor() {
      const message = UserErrorMessage.UNAUTHORIZED;
      super(message);
    }
  }
}
