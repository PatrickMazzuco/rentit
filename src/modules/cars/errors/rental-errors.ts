import { BadRequestException } from "@nestjs/common";

import { RentalErrorMessage } from "./rental-error-messages.enum";

export namespace RentalError {
  export class CarAlearyRented extends BadRequestException {
    constructor() {
      const message = RentalErrorMessage.CAR_ALREADY_RENTED;
      super(message);
    }
  }

  export class UserAlreadyRenting extends BadRequestException {
    constructor() {
      const message = RentalErrorMessage.USER_ALREADY_RENTING;
      super(message);
    }
  }

  export class DurationTooLow extends BadRequestException {
    constructor(durationisHorus?: number) {
      let message = `${RentalErrorMessage.RENTAL_DURATION_TOO_LOW}`;

      if (durationisHorus)
        message = `${message}. Minimun duration: ${durationisHorus} hours`;

      super(message);
    }
  }
}
