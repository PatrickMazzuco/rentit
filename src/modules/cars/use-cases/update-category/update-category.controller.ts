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

import { CategoryDTO } from "../../dtos/category.dto";
import { UpdateCategoryBodyDTO } from "./dtos/update-category-body.dto";
import { UpdateCategoryService } from "./update-category.service";

@ApiTags("categories")
@Controller("categories")
@AdminJWTAuthGuard()
export class UpdateCategoryController {
  constructor(private readonly updateCategoryService: UpdateCategoryService) {}

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Category successfully updated",
    type: CategoryDTO,
  })
  @ApiNotFoundResponse({
    description: "Category not found",
    type: HttpExceptionDTO,
  })
  @ApiBadRequestResponse({
    description: "Category with given name already exists",
    type: HttpExceptionDTO,
  })
  async handle(
    @Param() { id }: FindByIdDTO,
    @Body() data: UpdateCategoryBodyDTO,
  ): Promise<void> {
    return this.updateCategoryService.execute({
      id,
      ...data,
    });
  }
}
