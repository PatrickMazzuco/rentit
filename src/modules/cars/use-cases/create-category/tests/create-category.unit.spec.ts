import { CategoryError } from "@modules/cars/errors/category.errors";
import { Test } from "@nestjs/testing";
import {
  getCategoryDTO,
  MockCategoriesRepository,
  MockCategoriesRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { CreateCategoryService } from "../create-category.service";

describe("CreateCategoryService", () => {
  let createCategoryService: CreateCategoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateCategoryService, MockCategoriesRepositoryProvider],
    }).compile();

    createCategoryService = moduleRef.get<CreateCategoryService>(
      CreateCategoryService,
    );
  });

  it("should be able to create a new category", async () => {
    const category = getCategoryDTO();

    jest.spyOn(MockCategoriesRepository, "findByName").mockResolvedValue(null);
    jest.spyOn(MockCategoriesRepository, "create").mockResolvedValue(category);

    const createdCategory = await createCategoryService.execute({
      name: category.name,
      description: category.description,
    });

    expect(createdCategory).toHaveProperty("id");
    expect(createdCategory).toEqual(
      expect.objectContaining({
        name: category.name,
        description: category.description,
      }),
    );
  });

  it("should not be able to create a category with duplicated name", async () => {
    const category = getCategoryDTO();

    jest
      .spyOn(MockCategoriesRepository, "findByName")
      .mockResolvedValue(category);

    await expect(
      createCategoryService.execute({
        name: category.name,
        description: category.description,
      }),
    ).rejects.toThrow(CategoryError.AlreadyExists);
  });
});
