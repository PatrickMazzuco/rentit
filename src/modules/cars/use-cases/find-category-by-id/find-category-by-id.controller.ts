import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { CategoryDTO } from "../../dtos/category.dto";
import { FindCategoryByIdService } from "./find-category-by-id.service";

@ApiTags("categories")
@Controller("categories")
export class FindCategoryByIdController {
  constructor(
    private readonly findCategoryByIdService: FindCategoryByIdService,
  ) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: "Category found",
    type: CategoryDTO,
  })
  @ApiNotFoundResponse({
    description: "Category not found",
    type: HttpExceptionDTO,
  })
  async handle(@Param() data: FindByIdDTO): Promise<CategoryDTO> {
    return this.findCategoryByIdService.execute(data);
  }
}
