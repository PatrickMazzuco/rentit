import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminJWTAuthGuard } from "@shared/decorators/admin-jwt-auth-guard.decorator";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { SpecificationDTO } from "../../dtos/specification.dto";
import { UpdateSpecificationBodyDTO } from "./dtos/update-specification-body.dto";
import { UpdateSpecificationService } from "./update-specification.service";

@ApiTags("specifications")
@Controller("specifications")
@AdminJWTAuthGuard()
export class UpdateSpecificationController {
  constructor(
    private readonly updateSpecificationService: UpdateSpecificationService,
  ) {}

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Specification successfully updated",
    type: SpecificationDTO,
  })
  @ApiNotFoundResponse({
    description: "Specification not found",
    type: HttpExceptionDTO,
  })
  @ApiBadRequestResponse({
    description: "Specification with given name already exists",
    type: HttpExceptionDTO,
  })
  async handle(
    @Param() { id }: FindByIdDTO,
    @Body() data: UpdateSpecificationBodyDTO,
  ): Promise<void> {
    return this.updateSpecificationService.execute({
      id,
      ...data,
    });
  }
}
