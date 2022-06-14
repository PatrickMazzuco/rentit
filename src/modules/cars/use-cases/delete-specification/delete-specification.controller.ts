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

import { SpecificationDTO } from "../../dtos/specification.dto";
import { DeleteSpecificationService } from "./delete-specification.service";

@ApiTags("specifications")
@Controller("specifications")
@AdminJWTAuthGuard()
export class DeleteSpecificationController {
  constructor(
    private readonly deleteSpecificationService: DeleteSpecificationService,
  ) {}

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: "Specification deleted",
    type: SpecificationDTO,
  })
  async handle(@Param() data: FindByIdDTO): Promise<void> {
    return this.deleteSpecificationService.execute(data);
  }
}
