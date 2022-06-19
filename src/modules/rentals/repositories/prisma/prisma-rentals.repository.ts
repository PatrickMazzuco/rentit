import { PrismaService } from "@modules/database/prisma";
import { RentalSortingFields } from "@modules/rentals/enums/rental-sorting-fields.enum";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";
import { TargetSortingOrder } from "@shared/enums/sorting-order.enum";

import { CreateRentalDTO } from "../dtos/create-rental.dto";
import { RentalFiltersDTO } from "../dtos/rental-filters.dto";
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

  async list(
    {
      limit,
      order = TargetSortingOrder.DESC,
      skip,
      sort = RentalSortingFields.CREATED_AT,
    }: RepositoryPaginationOptions<RentalSortingFields>,
    filters: RentalFiltersDTO,
  ): Promise<ListAndCountDTO<RentalDTO>> {
    const findOptions = {
      orderBy: {
        [sort]: order,
      },
      where: {
        ...filters,
      },
    };

    const count = await this.prisma.rental.count(findOptions);
    const data = await this.prisma.rental.findMany({
      ...findOptions,
      skip,
      take: limit,
      include: {
        car: true,
        user: true,
      },
    });

    return {
      data,
      count,
    };
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
