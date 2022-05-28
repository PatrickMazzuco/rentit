import { BadRequestException, NotFoundException } from "@nestjs/common";

import { CategoryErrorMessage } from "./category-error-messages.enum";

export namespace CategoryError {
  export class NotFound extends NotFoundException {
    constructor() {
      const message = CategoryErrorMessage.NOT_FOUND;
      super(message);
    }
  }

  export class AlreadyExists extends BadRequestException {
    constructor() {
      const message = CategoryErrorMessage.ALREADY_EXISTS;
      super(message);
    }
  }
}
