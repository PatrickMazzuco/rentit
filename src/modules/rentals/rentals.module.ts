import { AccountsModule } from "@modules/accounts/accounts.module";
import { CarsModule } from "@modules/cars/cars.module";
import { DatabaseModule } from "@modules/database/database.module";
import { Module } from "@nestjs/common";

import { CreateRentalController } from "./use-cases/create-rental/create-rental.controller";
import { CreateRentalService } from "./use-cases/create-rental/create-rental.service";
import { ReturnRentedCarController } from "./use-cases/return-rented-car/return-rented-car.controller";
import { ReturnRentedCarService } from "./use-cases/return-rented-car/return-rented-car.service";

@Module({
  imports: [DatabaseModule, AccountsModule, CarsModule],
  controllers: [CreateRentalController, ReturnRentedCarController],
  providers: [CreateRentalService, ReturnRentedCarService],
})
export class RentalsModule {}
