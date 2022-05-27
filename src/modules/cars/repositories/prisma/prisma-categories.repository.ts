import { Category, PrismaClient } from "@prisma/client";
import { prisma } from "@src/database/prisma";

import { ICategoriesRepository } from "../categories-repository.interface";
import { CreateCategoryDTO } from "../dtos/create-category.dto";

export class PrismaCategoriesRepository implements ICategoriesRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

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
