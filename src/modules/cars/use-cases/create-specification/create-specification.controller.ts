import { HttpExceptionDTO } from "@errors/http/http-exception.dto";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";

import { SpecificationDTO } from "../../dtos/specification.dto";
import { SpecificationErrorMessage } from "../../errors/specification-error-messages.enum";
import { CreateSpecificationService } from "./create-specification.service";
import { CreateSpecificationDTO } from "./dtos/create-specification.dto";

@ApiTags("specifications")
@Controller("specifications")
export class CreateSpecificationController {
  constructor(
    private readonly createSpecificationService: CreateSpecificationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Specification successfully created",
    type: SpecificationDTO,
  })
  @ApiBadRequestResponse({
    description: SpecificationErrorMessage.ALREADY_EXISTS,
    type: HttpExceptionDTO,
  })
  async handle(
    @Body() data: CreateSpecificationDTO,
  ): Promise<SpecificationDTO> {
    return this.createSpecificationService.execute(data);
  }
}
