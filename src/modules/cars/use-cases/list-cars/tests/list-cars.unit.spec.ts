import { Test } from "@nestjs/testing";
import {
  getCarDTO,
  MockCarsRepository,
  MockCarsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { ListCarsService } from "../list-cars.service";

describe("ListCarsService", () => {
  let listCarsService: ListCarsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ListCarsService, MockCarsRepositoryProvider],
    }).compile();

    listCarsService = moduleRef.get<ListCarsService>(ListCarsService);
  });

  it("should be able to create a new car", async () => {
    const car = getCarDTO();

    jest.spyOn(MockCarsRepository, "list").mockResolvedValue({
      count: 1,
      data: [car],
    });

    const foundCars = await listCarsService.execute({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
    });

    expect(foundCars.data).toHaveLength(1);
    expect(foundCars.data[0]).toHaveProperty("id", car.id);
  });
});
