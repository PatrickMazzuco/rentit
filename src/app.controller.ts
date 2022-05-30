import { Controller, Get } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

import { AppService } from "./app.service";

@Controller("status")
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  handle() {
    return this.appService.execute();
  }
}
