import { AuthError } from "@modules/accounts/errors/auth.errors";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { RentalError } from "@modules/rentals/errors/rental-errors";
import { IRentalsRepository } from "@modules/rentals/repositories/rentals-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { ReturnRentedCarDTO } from "./dtos/return-rented-car.dto";

@Injectable()
export class ReturnRentedCarService {
  constructor(
    @Inject(RepositoryToken.RENTALS_REPOSITORY)
    private readonly rentalsRepository: IRentalsRepository,
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
  ) {}

  async execute({ rentalId, user }: ReturnRentedCarDTO): Promise<RentalDTO> {
    const rental = await this.rentalsRepository.findById(rentalId);

    if (!rental) throw new RentalError.NotFound();
    if (rental.userId !== user.id && !user.isAdmin)
      throw new AuthError.NoPermission();

    if (rental.endDate) throw new RentalError.AlreadyReturned();

    rental.endDate = new Date();

    const daysRented = rental.endDate.getDate() - rental.startDate.getDate();
    const expectedRentalDays =
      rental.expectedReturnDate.getDate() - rental.startDate.getDate();

    const isOverdue = daysRented > expectedRentalDays;

    let price = 0;

    if (isOverdue) {
      const daysOverdue = daysRented - expectedRentalDays;
      price += daysOverdue * rental.car.fineAmount;
    }

    price +=
      daysRented > 1 ? rental.car.dailyRate * daysRented : rental.car.dailyRate;

    rental.total = price;

    await this.rentalsRepository.update(rental);
    await this.carsRepository.update({ ...rental.car, available: true });

    return rental;
  }
}
