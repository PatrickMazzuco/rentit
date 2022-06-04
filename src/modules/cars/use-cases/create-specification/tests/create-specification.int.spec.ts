import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { SpecificationErrorMessage } from "@modules/cars/errors/specification-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /specifications", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarsModule],
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

  it("should be able to create a new specification", async () => {
    const specificationData = getCreateSpecificationDTO();

    const createdSpecificationResponse = await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    expect(createdSpecificationResponse.body).toHaveProperty("id");
    expect(createdSpecificationResponse.body).toEqual(
      expect.objectContaining({
        name: specificationData.name,
        description: specificationData.description,
      }),
    );
  });

  it("should not be able to create a specification with duplicated name", async () => {
    const specificationData = getCreateSpecificationDTO();

    await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const createdSpecificationResponse = await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdSpecificationResponse.body).toHaveProperty(
      "message",
      SpecificationErrorMessage.ALREADY_EXISTS,
    );
  });
});
