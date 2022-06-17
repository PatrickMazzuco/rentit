import { RentalDTO } from "@modules/cars/dtos/rental.dto";
import { CarError } from "@modules/cars/errors/car.errors";
import { RentalError } from "@modules/cars/errors/rental-errors";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { IRentalsRepository } from "@modules/cars/repositories/rentals-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { CreateRentalDTO } from "./dtos/create-rental.dto";

const MIN_RENTAL_DURATION_IN_HOURS = 24;
const MIN_RENTAL_DURATION = MIN_RENTAL_DURATION_IN_HOURS * 60 * 60 * 1000;

@Injectable()
export class CreateRentalService {
  constructor(
    @Inject(RepositoryToken.RENTALS_REPOSITORY)
    private readonly rentalsRepository: IRentalsRepository,
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
  ) {}

  async execute({
    userId,
    carId,
    expectedReturnDate,
  }: CreateRentalDTO): Promise<RentalDTO> {
    const car = await this.carsRepository.findById(carId);

    if (!car) throw new CarError.NotFound();

    let existingRental = await this.rentalsRepository.findOneByCarId(carId);
    if (existingRental) throw new RentalError.CarAlearyRented();

    existingRental = await this.rentalsRepository.findOneByUserId(userId);
    if (existingRental) throw new RentalError.UserAlreadyRenting();

    const currentDate = new Date();
    const minDate = new Date();
    minDate.setTime(currentDate.getTime() + MIN_RENTAL_DURATION);

    const parsedExpectedReturnDate = new Date(expectedReturnDate);

    const rentalDurationIsLowerThanMin = parsedExpectedReturnDate < minDate;

    if (rentalDurationIsLowerThanMin)
      throw new RentalError.DurationTooLow(MIN_RENTAL_DURATION_IN_HOURS);

    const rental = await this.rentalsRepository.create({
      userId,
      carId,
      expectedReturnDate: parsedExpectedReturnDate,
      startDate: new Date(),
    });

    return rental;
  }
}
