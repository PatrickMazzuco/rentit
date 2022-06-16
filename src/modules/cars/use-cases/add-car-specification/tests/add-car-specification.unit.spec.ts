import { CarError } from "@modules/cars/errors/car.errors";
import { SpecificationError } from "@modules/cars/errors/specification.errors";
import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import {
  getCarDTO,
  getSpecificationDTO,
  MockCarsRepository,
  MockCarsRepositoryProvider,
  MockSpecificationsRepository,
  MockSpecificationsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { AddCarSpecificationService } from "../add-car-specification.service";

describe("AddCarSpecificationService", () => {
  let addCarSpecificationService: AddCarSpecificationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AddCarSpecificationService,
        MockSpecificationsRepositoryProvider,
        MockCarsRepositoryProvider,
      ],
    }).compile();

    addCarSpecificationService = moduleRef.get<AddCarSpecificationService>(
      AddCarSpecificationService,
    );
  });

  it("should be able to to add a specification to a car", async () => {
    const specification = getSpecificationDTO();
    const car = getCarDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findByIds")
      .mockResolvedValue([specification]);

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(car);

    jest.spyOn(MockCarsRepository, "update").mockResolvedValue();

    await expect(
      addCarSpecificationService.execute({
        id: car.id,
        specificationIds: [specification.id],
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to add an inexistent specification to a car", async () => {
    const specification = getSpecificationDTO();
    const car = getCarDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findByIds")
      .mockResolvedValue([specification]);

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(car);

    await expect(
      addCarSpecificationService.execute({
        id: car.id,
        specificationIds: [specification.id, uuidV4()],
      }),
    ).rejects.toBeInstanceOf(SpecificationError.MultipleNotFound);
  });

  it("should not be able to add a specification to an inexistent car", async () => {
    const specification = getSpecificationDTO();
    const car = getCarDTO();

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(null);

    await expect(
      addCarSpecificationService.execute({
        id: car.id,
        specificationIds: [specification.id],
      }),
    ).rejects.toBeInstanceOf(CarError.NotFound);
  });
});
