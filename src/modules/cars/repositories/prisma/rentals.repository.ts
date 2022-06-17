import { RentalDTO } from "@modules/cars/dtos/rental.dto";
import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";

import { CreateRentalDTO } from "../dtos/create-rental.dto";
import { IRentalsRepository } from "../rentals-repository.interface";

@Injectable()
export class PrismaRentalsRepository implements IRentalsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRentalDTO): Promise<RentalDTO> {
    const rental = await this.prisma.rental.create({
      data,
      include: {
        car: true,
        user: true,
      },
    });

    delete rental.user.password;

    return rental;
  }

  async findById(id: string): Promise<RentalDTO> {
    const rental = await this.prisma.rental.findUnique({
      where: {
        id,
      },
      include: {
        car: true,
        user: true,
      },
    });

    if (rental) delete rental.user.password;

    return rental;
  }

  async findOneByCarId(carId: string): Promise<RentalDTO> {
    const rental = await this.prisma.rental.findFirst({
      where: {
        carId,
      },
      include: {
        car: true,
        user: true,
      },
    });

    if (rental) delete rental.user.password;

    return rental;
  }

  async findOneByUserId(userId: string): Promise<RentalDTO> {
    const rental = await this.prisma.rental.findFirst({
      where: {
        userId,
      },
      include: {
        car: true,
        user: true,
      },
    });

    if (rental) delete rental.user.password;

    return rental;
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.rental.deleteMany({});
    }
  }
}
