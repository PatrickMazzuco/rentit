import { PrismaClient } from "@prisma/client";
import { prisma } from "@src/database/prisma";

import { ICategoriesRepository } from "../categories-repository.interface";
import { CategoryDTO } from "../dtos/category.dto";
import { CreateCategoryDTO } from "../dtos/create-category.dto";

export class PrismaCategoriesRepository implements ICategoriesRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async create(data: CreateCategoryDTO): Promise<CategoryDTO> {
    const createdCategory = await this.prisma.category.create({
      data,
    });

    return createdCategory;
  }

  async findById(id: string): Promise<CategoryDTO | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string): Promise<CategoryDTO | null> {
    return this.prisma.category.findFirst({
      where: {
        name,
      },
    });
  }
}
