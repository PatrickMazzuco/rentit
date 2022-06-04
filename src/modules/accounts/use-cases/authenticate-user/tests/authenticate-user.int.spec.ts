import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { AccountsModule } from "@modules/accounts/accounts.module";
import { AuthErrorMessage } from "@modules/accounts/errors/auth-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import * as request from "supertest";

describe("[POST] /auth", () => {
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

    await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    return {
      email: userData.email,
      username: userData.username,
      password: userData.password,
    };
  };

  it("should be able to authenticate with email and password", async () => {
    const { email, password } = await createUser();

    const authResponse = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: email,
        password,
      })
      .expect(HttpStatus.OK);

    expect(authResponse.body).toHaveProperty("accessToken");
  });

  it("should be able to authenticate with username and password", async () => {
    const { username, password } = await createUser();

    const authResponse = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: username,
        password,
      })
      .expect(HttpStatus.OK);

    expect(authResponse.body).toHaveProperty("accessToken");
  });

  it("should not be able to authenticate with inexistent username", async () => {
    const { password } = await createUser();

    const authResponse = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: "inexistent-username",
        password,
      })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(authResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INVALID_CREDENTIALS,
    );
  });

  it("should not be able to authenticate with inexistent email", async () => {
    const { password } = await createUser();

    const authResponse = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: "inexistent-email",
        password,
      })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(authResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INVALID_CREDENTIALS,
    );
  });

  it("should not be able to authenticate with wrong password", async () => {
    const { email } = await createUser();

    const authResponse = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: email,
        password: "wrong-password",
      })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(authResponse.body).toHaveProperty(
      "message",
      AuthErrorMessage.INVALID_CREDENTIALS,
    );
  });
});
