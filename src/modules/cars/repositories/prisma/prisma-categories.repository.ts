import { CategorySortingFields } from "@modules/cars/enums/category-sorting-fields.enum";
import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";
import { TargetSortingOrder } from "@shared/enums/sorting-order.enum";

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

  async list({
    limit,
    order = TargetSortingOrder.ASC,
    skip,
    sort = CategorySortingFields.NAME,
  }: RepositoryPaginationOptions<CategorySortingFields>): Promise<
    ListAndCountDTO<Category>
  > {
    const filters = {
      orderBy: {
        [sort]: order,
      },
    };

    const count = await this.prisma.category.count(filters);
    const data = await this.prisma.category.findMany({
      ...filters,
      skip,
      take: limit,
    });

    return {
      data,
      count,
    };
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.category.deleteMany({});
    }
  }
}
