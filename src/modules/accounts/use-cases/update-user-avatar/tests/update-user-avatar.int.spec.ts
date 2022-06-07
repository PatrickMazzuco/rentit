import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AccountsModule } from "@modules/accounts/accounts.module";
import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import * as path from "node:path";
import * as request from "supertest";

const testAssetsFolder = "../../../../../utils/tests/assets";

describe("[PATCH] /users/avatar", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AccountsModule],
    }).compile();

    clearDatabase = moduleRef.get<ClearDatabase>(ClearDatabase);

    app = moduleRef.createNestApplication();

    setupGlobalPipes({ app });
    setupGlobalFilters({ app });

    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase.execute();
  });

  afterAll(async () => {
    await app.close();
  });

  const createUser = async () => {
    const userData = getCreateUserDTO();

    const createdUserResponse = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    const createdUser: UserDTO = createdUserResponse.body;

    return {
      ...createdUser,
      password: userData.password,
    };
  };

  it("should be able to update a user's avatar", async () => {
    const user = await createUser();

    const newAvatar = path.resolve(
      __dirname,
      testAssetsFolder,
      `./png-test-image.png`,
    );

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: user.email,
        password: user.password,
      })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .patch("/users/avatar")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .attach("avatar", newAvatar)
      .expect(HttpStatus.NO_CONTENT);
  });

  it("should not be able to update a user's avatar with invalid file extension", async () => {
    const user = await createUser();

    const newAvatar = path.resolve(
      __dirname,
      testAssetsFolder,
      `./gif-test-image.gif`,
    );

    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: user.email,
        password: user.password,
      })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .patch("/users/avatar")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .attach("avatar", newAvatar)
      .expect(HttpStatus.BAD_REQUEST);
  });
});
