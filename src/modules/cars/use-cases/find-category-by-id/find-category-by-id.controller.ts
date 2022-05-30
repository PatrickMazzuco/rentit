import { HttpExceptionDTO } from "@errors/http/http-exception.dto";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";

import { CategoryDTO } from "../../dtos/category.dto";
import { FindCategoryByIdService } from "./find-category-by-id.service";

@ApiTags("categories")
@Controller("categories")
export class FindCategoryByIdController {
  constructor(
    private readonly findCategoryByIdService: FindCategoryByIdService,
  ) {}

  @Get(":id")
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