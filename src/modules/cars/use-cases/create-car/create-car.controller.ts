import { CarDTO } from "@modules/cars/dtos/car.dto";
import { CarErrorMessage } from "@modules/cars/errors/car-error-messages.enum";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminJWTAuthGuard } from "@shared/decorators/admin-jwt-auth-guard.decorator";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { CreateCarService } from "./create-car.service";
import { CreateCarDTO } from "./dtos/create-car.dto";

@ApiTags("cars")
@Controller("cars")
@AdminJWTAuthGuard()
export class CreateCarController {
  constructor(private readonly createCarService: CreateCarService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Car successfully created",
    type: CarDTO,
  })
  @ApiBadRequestResponse({
    description: CarErrorMessage.ALREADY_EXISTS,
    type: HttpExceptionDTO,
  })
  @ApiNotFoundResponse({
    description: CategoryErrorMessage.NOT_FOUND,
    type: HttpExceptionDTO,
  })
  async handle(@Body() data: CreateCarDTO): Promise<CarDTO> {
    return this.createCarService.execute(data);
  }
}
