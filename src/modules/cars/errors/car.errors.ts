import { BadRequestException, NotFoundException } from "@nestjs/common";

import { CarErrorMessage } from "./car-error-messages.enum";

export namespace CarError {
  export class NotFound extends NotFoundException {
    constructor() {
      const message = CarErrorMessage.NOT_FOUND;
      super(message);
    }
  }

  export class AlreadyExists extends BadRequestException {
    constructor() {
      const message = CarErrorMessage.ALREADY_EXISTS;
      super(message);
    }
  }
}
