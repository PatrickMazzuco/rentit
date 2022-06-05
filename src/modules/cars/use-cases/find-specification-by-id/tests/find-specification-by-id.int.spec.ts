import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { SpecificationErrorMessage } from "@modules/cars/errors/specification-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /specifications/{id}", () => {
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

  it("should be able to find an existing specification", async () => {
    const specificationData = getCreateSpecificationDTO();

    const { body: createdSpecification } = await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const { body: foundSpecification } = await request(app.getHttpServer())
      .get(`/specifications/${createdSpecification.id}`)
      .expect(HttpStatus.OK);

    expect(foundSpecification).toHaveProperty("id", createdSpecification.id);
    expect(foundSpecification).toEqual(
      expect.objectContaining({
        name: createdSpecification.name,
        description: createdSpecification.description,
      }),
    );
  });

  it("should not be able to find an inexistent specification", async () => {
    const { body: foundSpecification } = await request(app.getHttpServer())
      .get(`/specifications/${uuidV4()}`)
      .expect(HttpStatus.NOT_FOUND);

    expect(foundSpecification).toHaveProperty(
      "message",
      SpecificationErrorMessage.NOT_FOUND,
    );
  });
});
