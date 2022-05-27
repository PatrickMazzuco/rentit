import { BadRequestException } from "@src/errors";
import {
  getCategoryDTO,
  MockCategoriesRepository,
} from "@src/utils/tests/mocks/cars";

import { CreateCategoryService } from "../create-category.service";

afterEach(() => {
  jest.clearAllMocks();
});

describe("CreateCategory", () => {
  it("should be able to create a new category", async () => {
    const categoryData = getCategoryDTO();

    jest
      .spyOn(MockCategoriesRepository, "create")
      .mockResolvedValueOnce(categoryData);

    const createCategory = new CreateCategoryService(MockCategoriesRepository);

    const { name, description } = categoryData;

    const category = await createCategory.execute({
      name,
      description,
    });

    expect(category).toHaveProperty("id");
  });

  it("should not be able to create a category with duplicated name", async () => {
    const categoryData = getCategoryDTO();

    jest
      .spyOn(MockCategoriesRepository, "findByName")
      .mockResolvedValueOnce(categoryData);

    const createCategory = new CreateCategoryService(MockCategoriesRepository);

    const { name, description } = categoryData;

    await expect(
      createCategory.execute({
        name,
        description,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
