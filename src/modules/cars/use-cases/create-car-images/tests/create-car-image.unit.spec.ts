import { CarError } from "@modules/cars/errors/car.errors";
import { UploadImagesService } from "@modules/files/services/upload-images/upload-images.service";
import { Provider } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  getCarDTO,
  MockCarsRepository,
  MockCarsRepositoryProvider,
} from "@utils/tests/mocks/cars";
import {
  getCarImageDTO,
  MockCarImagesRepository,
  MockCarImagesRepositoryProvider,
} from "@utils/tests/mocks/cars/car-images.mock";
import { getImageMock } from "@utils/tests/mocks/files/files.mock";

import { CreateCarImagesService } from "../create-car-images.service";

const mockUploadImagesService = {
  execute: jest.fn(),
};

const MockUploadImageServiceProvider: Provider = {
  provide: UploadImagesService,
  useValue: mockUploadImagesService,
};

describe("CreateCarImagesService", () => {
  let createCarImagesService: CreateCarImagesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateCarImagesService,
        MockUploadImageServiceProvider,
        MockCarsRepositoryProvider,
        MockCarImagesRepositoryProvider,
      ],
    }).compile();

    createCarImagesService = moduleRef.get<CreateCarImagesService>(
      CreateCarImagesService,
    );
  });

  it("should be able to add images to a car", async () => {
    const image = getImageMock();
    const carImage = getCarImageDTO();
    const imagePath = "test.jpg";
    const car = getCarDTO();

    jest
      .spyOn(mockUploadImagesService, "execute")
      .mockResolvedValue({ filePaths: [imagePath] });

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(car);
    jest.spyOn(MockCarImagesRepository, "create").mockResolvedValue(carImage);

    await expect(
      createCarImagesService.execute({
        images: [image],
        carId: "user-id",
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to add images to an inexistent car", async () => {
    const image = getImageMock();
    const imagePath = "test.jpg";

    jest
      .spyOn(mockUploadImagesService, "execute")
      .mockResolvedValue({ filePaths: [imagePath] });

    jest.spyOn(MockCarsRepository, "findById").mockResolvedValue(null);

    await expect(
      createCarImagesService.execute({
        images: [image],
        carId: "user-id",
      }),
    ).rejects.toThrow(CarError.NotFound);
  });
});
