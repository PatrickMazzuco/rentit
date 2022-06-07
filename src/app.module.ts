import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getEnvFilename, getEnvVariables } from "./config/env";
import { CarsModule } from "./modules/cars/cars.module";
import { DatabaseModule } from "./modules/database/database.module";
import { AccountsModule } from './modules/accounts/accounts.module';
import { FilesModule } from './modules/files/files.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
