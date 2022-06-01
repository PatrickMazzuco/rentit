import { CategoryError } from "@modules/cars/errors/category.errors";
import { Test } from "@nestjs/testing";
import {
  getCategoryDTO,
  MockCategoriesRepository,
  MockCategoriesRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { FindCategoryByIdService } from "../find-category-by-id.service";

describe("FindCategoryByIdService", () => {
  let findCategoryByIdService: FindCategoryByIdService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindCategoryByIdService, MockCategoriesRepositoryProvider],
    }).compile();

    findCategoryByIdService = moduleRef.get<FindCategoryByIdService>(
      FindCategoryByIdService,
    );
  });

  it("should be able to find an existing category", async () => {
    const category = getCategoryDTO();

    jest
      .spyOn(MockCategoriesRepository, "findById")
      .mockResolvedValue(category);

    const foundCategory = await findCategoryByIdService.execute({
      id: category.id,
    });

    expect(foundCategory).toHaveProperty("id");
    expect(foundCategory).toEqual(
      expect.objectContaining({
        name: category.name,
        description: category.description,
      }),
    );
  });

  it("should not be able to find an inexistent category", async () => {
    const category = getCategoryDTO();

    jest.spyOn(MockCategoriesRepository, "findById").mockResolvedValue(null);

    await expect(
      findCategoryByIdService.execute({
        id: category.id,
      }),
    ).rejects.toThrow(CategoryError.NotFound);
  });
});
