import { Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "@src/modules/database/prisma";

import { ICategoriesRepository } from "../categories-repository.interface";
import { CreateCategoryDTO } from "../dtos/create-category.dto";

@Injectable()
export class PrismaCategoriesRepository implements ICategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDTO): Promise<Category> {
    const createdCategory = await this.prisma.category.create({
      data,
    });

    return createdCategory;
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        name,
      },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.category.deleteMany({});
    }
  }
}
