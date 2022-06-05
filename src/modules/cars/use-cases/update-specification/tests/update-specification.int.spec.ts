import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { SpecificationErrorMessage } from "@modules/cars/errors/specification-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[PUT] /specifications/{id}", () => {
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

  it("should be able to update a specification", async () => {
    const specificationData = getCreateSpecificationDTO();

    const { body: createdSpecification } = await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    await request(app.getHttpServer())
      .put(`/specifications/${createdSpecification.id}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.NO_CONTENT);

    const { body: foundSpecification } = await request(app.getHttpServer())
      .get(`/specifications/${createdSpecification.id}`)
      .expect(HttpStatus.OK);

    expect(foundSpecification).toHaveProperty("id", createdSpecification.id);
    expect(foundSpecification).toEqual(
      expect.objectContaining({
        name: updatedSpecificationData.name,
        description: updatedSpecificationData.description,
      }),
    );
  });

  it("should not be able to update a specification to have a duplicated name", async () => {
    const specificationData = getCreateSpecificationDTO();

    const { body: createdSpecification } = await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    await request(app.getHttpServer())
      .post("/specifications")
      .send(updatedSpecificationData)
      .expect(HttpStatus.CREATED);

    const { body: updatedSpecification } = await request(app.getHttpServer())
      .put(`/specifications/${createdSpecification.id}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(updatedSpecification).toHaveProperty(
      "message",
      SpecificationErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to update an inexistent specification", async () => {
    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    const { body: updatedSpecification } = await request(app.getHttpServer())
      .put(`/specifications/${uuidV4()}`)
      .send(updatedSpecificationData)
      .expect(HttpStatus.NOT_FOUND);

    expect(updatedSpecification).toHaveProperty(
      "message",
      SpecificationErrorMessage.NOT_FOUND,
    );
  });
});
