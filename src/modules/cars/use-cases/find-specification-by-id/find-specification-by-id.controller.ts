import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { SpecificationDTO } from "../../dtos/specification.dto";
import { FindSpecificationByIdService } from "./find-specification-by-id.service";

@ApiTags("specifications")
@Controller("specifications")
export class FindSpecificationByIdController {
  constructor(
    private readonly findSpecificationByIdService: FindSpecificationByIdService,
  ) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Specification found",
    type: SpecificationDTO,
  })
  @ApiNotFoundResponse({
    description: "Specification not found",
    type: HttpExceptionDTO,
  })
  async handle(@Param() data: FindByIdDTO): Promise<SpecificationDTO> {
    return this.findSpecificationByIdService.execute(data);
  }
}
