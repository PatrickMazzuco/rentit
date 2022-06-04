import { BadRequestException, NotFoundException } from "@nestjs/common";

import { SpecificationErrorMessage } from "./specification-error-messages.enum";

export namespace SpecificationError {
  export class NotFound extends NotFoundException {
    constructor() {
      const message = SpecificationErrorMessage.NOT_FOUND;
      super(message);
    }
  }

  export class AlreadyExists extends BadRequestException {
    constructor() {
      const message = SpecificationErrorMessage.ALREADY_EXISTS;
      super(message);
    }
  }
}
