import { createMock } from "@golevelup/ts-jest";
import { ICategoriesRepository } from "@modules/cars/repositories/categories-repository.interface";
import { CategoryDTO } from "@src/modules/cars/dtos/category.dto";
import { CreateCategoryDTO } from "@src/modules/cars/use-cases/create-category/dtos/create-categoty.dto";
import { uuidV4 } from "@src/utils/misc/uuid";

export const MockCategoriesRepository: ICategoriesRepository =
  createMock<ICategoriesRepository>();

export const getCategoryDTO = (): CategoryDTO => {
  return {
    id: uuidV4(),
    name: "SUV",
    description: "Descrição da categoria SUV",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getCreateCategoryDTO = (): CreateCategoryDTO => {
  const categoryDTO = getCategoryDTO();

  return {
    description: categoryDTO.description,
    name: categoryDTO.name,
  };
};
