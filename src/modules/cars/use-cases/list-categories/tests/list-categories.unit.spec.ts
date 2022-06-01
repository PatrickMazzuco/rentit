import { Test } from "@nestjs/testing";
import {
  getCategoryDTO,
  MockCategoriesRepository,
  MockCategoriesRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { ListCategoriesService } from "../list-categories.service";

describe("ListCategoriesService", () => {
  let listCategoriesService: ListCategoriesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ListCategoriesService, MockCategoriesRepositoryProvider],
    }).compile();

    listCategoriesService = moduleRef.get<ListCategoriesService>(
      ListCategoriesService,
    );
  });

  it("should be able to create a new category", async () => {
    const category = getCategoryDTO();

    jest.spyOn(MockCategoriesRepository, "list").mockResolvedValue({
      count: 1,
      data: [category],
    });

    const foundCategories = await listCategoriesService.execute({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
    });

    expect(foundCategories.data).toHaveLength(1);
    expect(foundCategories.data[0]).toHaveProperty("id", category.id);
  });
});
