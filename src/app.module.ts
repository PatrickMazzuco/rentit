import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getEnvFilename, getEnvVariables } from "./config/env";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { CarsModule } from "./modules/cars/cars.module";
import { DatabaseModule } from "./modules/database/database.module";
import { FilesModule } from "./modules/files/files.module";
import { RentalsModule } from "./modules/rentals/rentals.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getEnvFilename()],
      load: [getEnvVariables],
    }),
    CarsModule,
    DatabaseModule,
    AccountsModule,
    FilesModule,
    RentalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
