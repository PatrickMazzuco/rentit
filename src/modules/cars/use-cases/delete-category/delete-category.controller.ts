import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { AdminJWTAuthGuard } from "@shared/decorators/admin-jwt-auth-guard.decorator";
import { FindByIdDTO } from "@shared/dtos/find-by-id.dto";

import { CategoryDTO } from "../../dtos/category.dto";
import { DeleteCategoryService } from "./delete-category.service";

@ApiTags("categories")
@Controller("categories")
@AdminJWTAuthGuard()
export class DeleteCategoryController {
  constructor(private readonly deleteCategoryService: DeleteCategoryService) {}

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Category deleted",
    type: CategoryDTO,
  })
  async handle(@Param() data: FindByIdDTO): Promise<void> {
    return this.deleteCategoryService.execute(data);
  }
}
