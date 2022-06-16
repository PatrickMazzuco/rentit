import { CarSortingFields } from "@modules/cars/enums/car-sorting-fields.enum";
import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";
import { TargetSortingOrder } from "@shared/enums/sorting-order.enum";
import { parsePrismaFilters } from "@utils/prisma/parse-filters";

import { ICarsRepository } from "../cars-repository.interface";
import { CarFiltersDTO } from "../dtos/car-filters.dto";
import { CarDTO } from "../dtos/car.dto";
import { CreateCarDTO } from "../dtos/create-car.dto";

@Injectable()
export class PrismaCarsRepository implements ICarsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCarDTO): Promise<CarDTO> {
    const car = await this.prisma.car.create({
      data: {
        ...data,
      },
    });

    return car;
  }

  async findById(id: string): Promise<CarDTO> {
    return this.prisma.car.findUnique({
      where: {
        id,
      },
      include: {
        specifications: true,
        category: true,
      },
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<CarDTO> {
    return this.prisma.car.findUnique({
      where: {
        licensePlate,
      },
      include: {
        specifications: true,
        category: true,
      },
    });
  }

  async list(
    {
      limit,
      order = TargetSortingOrder.ASC,
      skip,
      sort = CarSortingFields.NAME,
    }: RepositoryPaginationOptions<CarSortingFields>,
    { available = true, ...filters }: CarFiltersDTO,
  ): Promise<ListAndCountDTO<CarDTO>> {
    const parsedFilters = parsePrismaFilters(filters);

    const findOptions = {
      orderBy: {
        [sort]: order,
      },
      where: {
        available,
        ...parsedFilters,
      },
    };

    const count = await this.prisma.car.count(findOptions);
    const data = await this.prisma.car.findMany({
      ...findOptions,
      skip,
      take: limit,
    });

    return {
      data,
      count,
    };
  }

  async update({
    id,
    name,
    description,
    brand,
    licensePlate,
    available,
    dailyRate,
    fineAmount,
    specifications,
    category,
  }: CarDTO): Promise<void> {
    const dataToUpdate: Prisma.CarUpdateInput = {
      name,
      description,
      brand,
      licensePlate,
      available,
      dailyRate,
      fineAmount,
      specifications: {
        deleteMany: {},
        create: specifications,
      },
    };

    if (category) dataToUpdate.category = { connect: { id: category.id } };

    await this.prisma.car.update({
      where: { id },
      data: dataToUpdate,
      include: { specifications: true },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.car.deleteMany({});
    }
  }
}
