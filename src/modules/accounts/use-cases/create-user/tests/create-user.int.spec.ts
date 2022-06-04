import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AccountsModule } from "@modules/accounts/accounts.module";
import { UserErrorMessage } from "@modules/accounts/errors/users-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import * as request from "supertest";

describe("[POST] /users", () => {
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

  it("should be able to create a new user", async () => {
    const userData = getCreateUserDTO();

    const createdUserResponse = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    expect(createdUserResponse.body).toHaveProperty("id");
    expect(createdUserResponse.body).toEqual(
      expect.objectContaining({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        isAdmin: false,
        driversLicense: userData.driversLicense,
      }),
    );
  });

  it("should not be able to create a user with duplicated email", async () => {
    const userData = getCreateUserDTO();

    await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    const createdUserResponse = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdUserResponse.body).toHaveProperty(
      "message",
      UserErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to create a user with duplicated username", async () => {
    const userData = getCreateUserDTO();

    await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    const createdUserResponse = await request(app.getHttpServer())
      .post("/users")
      .send({
        ...userData,
        email: "mock@email.com",
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdUserResponse.body).toHaveProperty(
      "message",
      UserErrorMessage.ALREADY_EXISTS,
    );
  });
});
