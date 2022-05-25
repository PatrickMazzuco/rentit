import { BadRequestException } from "@src/errors";
import { ICategoriesRepository } from "@src/modules/cars/repositories/categories-repository.interface";
import { uuidV4 } from "@src/utils/misc/uuid";

import { CreateCategoryService } from "../create-category.service";

const categoryRepository: ICategoriesRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
};

describe("CreateCategory", () => {
  it("should be able to create a new category", async () => {
    const categoryData = {
      id: uuidV4(),
      name: "SUV",
      description: "Descrição da categoria SUV",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(categoryRepository, "create")
      .mockResolvedValueOnce(categoryData);

    const createCategory = new CreateCategoryService(categoryRepository);

    const { name, description } = categoryData;

    const category = await createCategory.execute({
      name,
      description,
    });

    expect(category).toHaveProperty("id");
  });

  it("should not be able to create a category with duplicated name", async () => {
    const categoryData = {
      id: uuidV4(),
      name: "SUV",
      description: "Descrição da categoria SUV",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(categoryRepository, "findByName")
      .mockResolvedValueOnce(categoryData);

    const createCategory = new CreateCategoryService(categoryRepository);

    const { name, description } = categoryData;

    await expect(
      createCategory.execute({
        name,
        description,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
