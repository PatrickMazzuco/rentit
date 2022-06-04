import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import {
  getCategoryDTO,
  MockCategoriesRepository,
  MockCategoriesRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { DeleteCategoryService } from "../delete-category.service";

describe("DeleteCategoryService", () => {
  let deleteCategoryService: DeleteCategoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DeleteCategoryService, MockCategoriesRepositoryProvider],
    }).compile();

    deleteCategoryService = moduleRef.get<DeleteCategoryService>(
      DeleteCategoryService,
    );
  });

  it("should be able to delete an existing category", async () => {
    const category = getCategoryDTO();

    jest
      .spyOn(MockCategoriesRepository, "findById")
      .mockResolvedValue(category);

    await expect(
      deleteCategoryService.execute({
        id: category.id,
      }),
    ).resolves.not.toThrow();
  });

  it("should not return error when deleting an inexistent category", async () => {
    jest.spyOn(MockCategoriesRepository, "findById").mockResolvedValue(null);

    await expect(
      deleteCategoryService.execute({
        id: uuidV4(),
      }),
    ).resolves.not.toThrow();
  });
});
