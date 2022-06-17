import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";
import { CarImage, Prisma } from "@prisma/client";

import { ICarImagesRepository } from "../car-images-repository.interface";
import { CarImageDTO } from "../dtos/car-image.dto";
import { CreateCarImageDTO } from "../dtos/create-car-image.dto";

@Injectable()
export class PrismaCarImagesRepository implements ICarImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCarImageDTO): Promise<CarImage> {
    const createdCarImage = await this.prisma.carImage.create({
      data,
    });

    return createdCarImage;
  }

  async findById(id: string): Promise<CarImage | null> {
    return this.prisma.carImage.findUnique({
      where: {
        id,
      },
    });
  }

  async update({ id, image, description, carId }: CarImageDTO): Promise<void> {
    const dataToUpdate = {
      image,
      description,
      car: {
        connect: {
          id: carId,
        },
      },
    } as Prisma.CarImageUpdateInput;

    await this.prisma.carImage.update({
      data: dataToUpdate,
      where: {
        id,
      },
    });
  }

  async delete(data: CarImageDTO): Promise<void> {
    await this.prisma.carImage.delete({
      where: {
        id: data.id,
      },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.carImage.deleteMany({});
    }
  }
}
