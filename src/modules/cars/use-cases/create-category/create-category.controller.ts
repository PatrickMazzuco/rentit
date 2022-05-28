import { HttpStatus } from "@src/errors";
import { HttpExceptionDTO } from "@src/errors/http/http-exception.dto";
import { Body, Post, Response, Route, SuccessResponse } from "tsoa";
import { container } from "tsyringe";

import { CategoryDTO } from "../../dtos/category.dto";
import { CreateCategoryService } from "./create-category.service";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

@Route("categories")
export class CreateCategoryController {
  /**
   * Creates a new car category.
   * The category name must be unique.
   */
  @Post()
  @SuccessResponse(HttpStatus.CREATED, "Category successfully created")
  @Response<HttpExceptionDTO>(
    HttpStatus.BAD_REQUEST,
    "Category already exists",
    {
      message: "Category already exists",
    },
  )
  async handle(@Body() data: CreateCategoryDTO): Promise<CategoryDTO> {
    const createCategoryService = container.resolve(CreateCategoryService);

    const category = await createCategoryService.execute(data);

    return category;
  }
}
