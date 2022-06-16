import { SpecificationSortingFields } from "@modules/cars/enums/specification-sorting-fields.enum";
import { PrismaService } from "@modules/database/prisma";
import { Injectable } from "@nestjs/common";
import { Specification } from "@prisma/client";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";
import { TargetSortingOrder } from "@shared/enums/sorting-order.enum";

import { CreateSpecificationDTO } from "../dtos/create-specification.dto";
import { SpecificationDTO } from "../dtos/specification.dto";
import { ISpecificationsRepository } from "../specifications-repository.interface";

@Injectable()
export class PrismaSpecificationsRepository
  implements ISpecificationsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSpecificationDTO): Promise<Specification> {
    const createdSpecification = await this.prisma.category.create({
      data,
    });

    return createdSpecification;
  }

  async findById(id: string): Promise<Specification | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIds(ids: string[]): Promise<SpecificationDTO[]> {
    return this.prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findByName(name: string): Promise<Specification | null> {
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
    sort = SpecificationSortingFields.NAME,
  }: RepositoryPaginationOptions<SpecificationSortingFields>): Promise<
    ListAndCountDTO<Specification>
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

  async update(data: SpecificationDTO): Promise<void> {
    await this.prisma.category.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  async delete(data: SpecificationDTO): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id: data.id,
      },
    });
  }

  async truncate(): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      await this.prisma.category.deleteMany({});
    }
  }
}
