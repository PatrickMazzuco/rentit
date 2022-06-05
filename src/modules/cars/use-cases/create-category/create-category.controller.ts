import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { HttpExceptionDTO } from "@shared/errors/http/http-exception.dto";

import { CategoryDTO } from "../../dtos/category.dto";
import { CategoryErrorMessage } from "../../errors/category-error-messages.enum";
import { CreateCategoryService } from "./create-category.service";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

@ApiTags("categories")
@Controller("categories")
export class CreateCategoryController {
  constructor(private readonly createCategoryService: CreateCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: "Category successfully created",
    type: CategoryDTO,
  })
  @ApiBadRequestResponse({
    description: CategoryErrorMessage.ALREADY_EXISTS,
    type: HttpExceptionDTO,
  })
  async handle(@Body() data: CreateCategoryDTO): Promise<CategoryDTO> {
    return this.createCategoryService.execute(data);
  }
}
