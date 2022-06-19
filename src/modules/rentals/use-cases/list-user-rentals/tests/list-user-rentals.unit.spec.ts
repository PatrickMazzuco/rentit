import { Test } from "@nestjs/testing";
import {
  getRentalDTO,
  MockRentalsRepository,
  MockRentalsRepositoryProvider,
} from "@utils/tests/mocks/rentals";

import { ListUserRentalsService } from "../list-user-rentals.service";

describe("ListUserRentalsService", () => {
  let listUserRentalsService: ListUserRentalsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ListUserRentalsService, MockRentalsRepositoryProvider],
    }).compile();

    listUserRentalsService = moduleRef.get<ListUserRentalsService>(
      ListUserRentalsService,
    );
  });

  it("should be able to create a new car", async () => {
    const rental = getRentalDTO();

    jest.spyOn(MockRentalsRepository, "list").mockResolvedValue({
      count: 1,
      data: [rental],
    });

    const foundCars = await listUserRentalsService.execute({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      userId: rental.userId,
    });

    expect(foundCars.data).toHaveLength(1);
    expect(foundCars.data[0]).toHaveProperty("id", rental.id);
  });
});
