import { CarError } from "@modules/cars/errors/car.errors";
import { CategoryError } from "@modules/cars/errors/category.errors";
import { Test } from "@nestjs/testing";
import {
  getCarDTO,
  MockCarsRepository,
  MockCarsRepositoryProvider,
  MockCategoriesRepository,
  MockCategoriesRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { CreateCarService } from "../create-car.service";

describe("CreateCarService", () => {
  let createCarService: CreateCarService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateCarService,
        MockCarsRepositoryProvider,
        MockCategoriesRepositoryProvider,
      ],
    }).compile();

    createCarService = moduleRef.get<CreateCarService>(CreateCarService);
  });

  it("should be able to create a new car", async () => {
    const car = getCarDTO();

    jest
      .spyOn(MockCategoriesRepository, "findById")
      .mockResolvedValue(car.category);
    jest
      .spyOn(MockCarsRepository, "findByLicensePlate")
      .mockResolvedValue(null);
    jest.spyOn(MockCarsRepository, "create").mockResolvedValue(car);

    const createdCar = await createCarService.execute({
      name: car.name,
      description: car.description,
      brand: car.brand,
      licensePlate: car.licensePlate,
      dailyRate: car.dailyRate,
      fineAmount: car.fineAmount,
      categoryId: car.category.id,
    });

    expect(createdCar).toHaveProperty("id");
    expect(createdCar).toEqual(
      expect.objectContaining({
        ...car,
      }),
    );
  });

  it("should not be able to create a car with duplicated licence plate", async () => {
    const car = getCarDTO();

    jest
      .spyOn(MockCategoriesRepository, "findById")
      .mockResolvedValue(car.category);
    jest.spyOn(MockCarsRepository, "findByLicensePlate").mockResolvedValue(car);

    await expect(
      createCarService.execute({
        name: car.name,
        description: car.description,
        brand: car.brand,
        licensePlate: car.licensePlate,
        dailyRate: car.dailyRate,
        fineAmount: car.fineAmount,
        categoryId: car.category.id,
      }),
    ).rejects.toThrow(CarError.AlreadyExists);
  });

  it("should not be able to create a car for an inexistent category", async () => {
    const car = getCarDTO();

    jest.spyOn(MockCategoriesRepository, "findById").mockResolvedValue(null);

    await expect(
      createCarService.execute({
        name: car.name,
        description: car.description,
        brand: car.brand,
        licensePlate: car.licensePlate,
        dailyRate: car.dailyRate,
        fineAmount: car.fineAmount,
        categoryId: car.category.id,
      }),
    ).rejects.toThrow(CategoryError.NotFound);
  });
});
