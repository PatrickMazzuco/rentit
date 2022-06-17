import { SpecificationErrorMessage } from "@modules/cars/errors/specification-error-messages.enum";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminJWTAuthGuard } from "@shared/decorators/admin-jwt-auth-guard.decorator";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { AddCarSpecificationService } from "./add-car-specification.service";
import { AddCarSpecificationBodyDTO } from "./dtos/add-car-specification-body.dto";

@ApiTags("cars")
@Controller("cars")
@AdminJWTAuthGuard()
export class AddCarSpecificationController {
  constructor(
    private readonly addCarSpecificationService: AddCarSpecificationService,
  ) {}

  @Put(":id/specifications")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Specifications successfully added",
  })
  @ApiNotFoundResponse({
    description: SpecificationErrorMessage.MULTIPLE_NOT_FOUND,
    type: HttpExceptionDTO,
  })
  async handle(
    @Param() { id }: FindByIdDTO,
    @Body() { specificationIds }: AddCarSpecificationBodyDTO,
  ): Promise<void> {
    await this.addCarSpecificationService.execute({ id, specificationIds });
  }
}
