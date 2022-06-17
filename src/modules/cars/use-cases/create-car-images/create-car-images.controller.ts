import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminJWTAuthGuard } from "@shared/decorators/admin-jwt-auth-guard.decorator";
import { MultiFileUploadEndpoint } from "@shared/decorators/file-upload.decorator";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { CreateCarImagesService } from "./create-car-images.service";

@ApiTags("cars")
@Controller("cars")
@AdminJWTAuthGuard()
export class CreateCarImagesController {
  constructor(
    private readonly createCarImagesService: CreateCarImagesService,
  ) {}

  @Post(":id/images")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Car images successfully created",
  })
  @ApiNotFoundResponse({
    description: CarErrorMessage.NOT_FOUND,
    type: HttpExceptionDTO,
  })
  @MultiFileUploadEndpoint("images")
  async handle(
    @UploadedFiles() images: Express.Multer.File[],
    @Param() { id }: FindByIdDTO,
  ): Promise<void> {
    return this.createCarImagesService.execute({
      carId: id,
      images,
    });
  }
}
