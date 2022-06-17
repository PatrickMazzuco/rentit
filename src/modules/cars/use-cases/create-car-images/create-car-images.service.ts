import { CarError } from "@modules/cars/errors/car.errors";
import { ICarImagesRepository } from "@modules/cars/repositories/car-images-repository.interface";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import {
  ValidImageFileExtension,
  ValidImageMimeType,
} from "@modules/files/services/upload-images/dtos/upload-image.dto";
import { UploadImagesService } from "@modules/files/services/upload-images/upload-images.service";
import { Inject, Injectable } from "@nestjs/common";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";

import { CreateCarImagesDTO } from "./dtos/create-car-images.dto";

export const validImageMimeTypes: ValidImageMimeType[] = [
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export const validImageFileExtensions: ValidImageFileExtension[] = [
  "png",
  "jpeg",
  "jpg",
];

export const carImagesDir = "cars";

@Injectable()
export class CreateCarImagesService {
  constructor(
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
    @Inject(RepositoryToken.CAR_IMAGES_REPOSITORY)
    private readonly carImagesRepository: ICarImagesRepository,
    private readonly uploadImagesService: UploadImagesService,
  ) {}

  public async execute({ carId, images }: CreateCarImagesDTO): Promise<void> {
    const car = await this.carsRepository.findById(carId);

    if (!car) {
      throw new CarError.NotFound();
    }

    const { filePaths: imagesFilenames } =
      await this.uploadImagesService.execute({
        directory: carImagesDir,
        images,
        validImageMimeTypes,
        validImageFileExtensions,
      });

    const parsedImages = imagesFilenames.map((imageFilename) => ({
      image: imageFilename,
      description: "Default description",
      carId: car.id,
    }));

    await Promise.all(
      parsedImages.map((image) => this.carImagesRepository.create(image)),
    );
  }
}
