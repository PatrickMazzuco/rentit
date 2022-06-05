import { Test } from "@nestjs/testing";
import {
  getSpecificationDTO,
  MockSpecificationsRepository,
  MockSpecificationsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { ListSpecificationsService } from "../list-specifications.service";

describe("ListSpecificationsService", () => {
  let listSpecificationsService: ListSpecificationsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListSpecificationsService,
        MockSpecificationsRepositoryProvider,
      ],
    }).compile();

    listSpecificationsService = moduleRef.get<ListSpecificationsService>(
      ListSpecificationsService,
    );
  });

  it("should be able to create a new specification", async () => {
    const specification = getSpecificationDTO();

    jest.spyOn(MockSpecificationsRepository, "list").mockResolvedValue({
      count: 1,
      data: [specification],
    });

    const foundSpecifications = await listSpecificationsService.execute({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
    });

    expect(foundSpecifications.data).toHaveLength(1);
    expect(foundSpecifications.data[0]).toHaveProperty("id", specification.id);
  });
});
