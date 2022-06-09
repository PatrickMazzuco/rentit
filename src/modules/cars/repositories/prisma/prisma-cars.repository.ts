import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";

import { ICarsRepository } from "../cars-repository.interface";
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
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<CarDTO> {
    return this.prisma.car.findUnique({
      where: {
        licensePlate,
      },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.car.deleteMany({});
    }
  }
}
