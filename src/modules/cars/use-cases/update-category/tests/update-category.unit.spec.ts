import { CategoryError } from "@modules/cars/errors/category.errors";
import { Test } from "@nestjs/testing";
import {
  getCategoryDTO,
  MockCategoriesRepository,
  MockCategoriesRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { UpdateCategoryService } from "../update-category.service";

describe("UpdateCategoryService", () => {
  let updateCategoryService: UpdateCategoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UpdateCategoryService, MockCategoriesRepositoryProvider],
    }).compile();

    updateCategoryService = moduleRef.get<UpdateCategoryService>(
      UpdateCategoryService,
    );
  });

  it("should not be able to update a category to have a duplicated name", async () => {
    const category = getCategoryDTO();

    const updatedCategoryData = {
      name: "Updated Category",
      description: "Updated Description",
    };

    jest
      .spyOn(MockCategoriesRepository, "findById")
      .mockResolvedValue(category);

    jest
      .spyOn(MockCategoriesRepository, "findByName")
      .mockResolvedValue(category);

    await expect(
      updateCategoryService.execute({
        id: category.id,
        ...updatedCategoryData,
      }),
    ).rejects.toThrow(CategoryError.AlreadyExists);
  });

  it("should be able to update a category", async () => {
    const category = getCategoryDTO();

    const updatedCategoryData = {
      name: "Updated Category",
      description: "Updated Description",
    };

    jest
      .spyOn(MockCategoriesRepository, "findById")
      .mockResolvedValue(category);

    jest.spyOn(MockCategoriesRepository, "findByName").mockResolvedValue(null);

    await expect(
      updateCategoryService.execute({
        id: category.id,
        ...updatedCategoryData,
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to update an inexistent category", async () => {
    const category = getCategoryDTO();

    const updatedCategoryData = {
      name: "Updated Category",
      description: "Updated Description",
    };

    jest.spyOn(MockCategoriesRepository, "findById").mockResolvedValue(null);

    await expect(
      updateCategoryService.execute({
        id: category.id,
        ...updatedCategoryData,
      }),
    ).rejects.toThrow(CategoryError.NotFound);
  });
});
