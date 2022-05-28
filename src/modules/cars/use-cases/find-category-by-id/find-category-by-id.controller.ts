import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { FindByIdDTO } from "@src/shared/dtos/find-by-id.dto";

import { CategoryDTO } from "../../dtos/category.dto";
import { FindCategoryByIdService } from "./find-category-by-id.service";

@Controller("categories")
export class FindCategoryByIdController {
  constructor(
    private readonly findCategoryByIdService: FindCategoryByIdService,
  ) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async handle(@Param() data: FindByIdDTO): Promise<CategoryDTO> {
    return this.findCategoryByIdService.execute(data);
  }
}
