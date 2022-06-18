import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CreateRentalDTO } from "../dtos/create-rental.dto";
import { RentalDTO } from "../dtos/rental.dto";
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

  async findOneActiveByCarId(carId: string): Promise<RentalDTO> {
    const rental = await this.prisma.rental.findFirst({
      where: {
        carId,
        endDate: null,
      },
      include: {
        car: true,
        user: true,
      },
    });

    if (rental) delete rental.user.password;

    return rental;
  }

  async findOneActiveByUserId(userId: string): Promise<RentalDTO> {
    const rental = await this.prisma.rental.findFirst({
      where: {
        userId,
        endDate: null,
      },
      include: {
        car: true,
        user: true,
      },
    });

    if (rental) delete rental.user.password;

    return rental;
  }

  async update({
    id,
    startDate,
    endDate,
    expectedReturnDate,
    total,
    carId,
    userId,
  }: RentalDTO): Promise<void> {
    const dataToUpdate: Prisma.RentalUpdateInput = {
      startDate,
      endDate,
      expectedReturnDate,
      total,
      car: {
        connect: {
          id: carId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };

    await this.prisma.rental.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });
  }

  async delete(data: RentalDTO): Promise<void> {
    await this.prisma.rental.delete({
      where: {
        id: data.id,
      },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.rental.deleteMany({});
    }
  }
}
