import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  execute() {
    return {
      status: "ok",
    };
  }
}
