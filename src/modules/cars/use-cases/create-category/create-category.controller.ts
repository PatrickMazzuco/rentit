import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { CategoryDTO } from "../../dtos/category.dto";
import { CreateCategoryService } from "./create-category.service";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

@Controller("categories")
export class CreateCategoryController {
  constructor(private readonly createCategoryService: CreateCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() data: CreateCategoryDTO): Promise<CategoryDTO> {
    return this.createCategoryService.execute(data);
  }
}
