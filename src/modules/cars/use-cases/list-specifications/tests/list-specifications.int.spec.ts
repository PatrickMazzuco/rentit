import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { getCreateSpecificationDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /specifications", () => {
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

  it("should be able to list specifications", async () => {
    const specificationData = {
      ...getCreateSpecificationDTO(),
      name: "Specification 1",
    };
    const secondSpecification = {
      ...getCreateSpecificationDTO(),
      name: "Specification 2",
    };

    const { body: createdSpecification } = await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post("/specifications")
      .send(secondSpecification)
      .expect(HttpStatus.CREATED);

    const { body: foundSpecifications } = await request(app.getHttpServer())
      .get("/specifications")
      .send()
      .expect(HttpStatus.OK);

    expect(foundSpecifications).toHaveProperty("data");
    expect(foundSpecifications).toHaveProperty("meta");
    expect(foundSpecifications).toHaveProperty("links");
    expect(foundSpecifications.data).toHaveLength(2);
    expect(foundSpecifications.data[0]).toHaveProperty(
      "id",
      createdSpecification.id,
    );
  });

  it("should be able to list specifications with filters", async () => {
    const specificationData = {
      ...getCreateSpecificationDTO(),
      name: "Specification 1",
    };
    const secondSpecification = {
      ...getCreateSpecificationDTO(),
      name: "Specification 2",
    };

    await request(app.getHttpServer())
      .post("/specifications")
      .send(specificationData)
      .expect(HttpStatus.CREATED);

    const { body: secondCreatedSpecification } = await request(
      app.getHttpServer(),
    )
      .post("/specifications")
      .send(secondSpecification)
      .expect(HttpStatus.CREATED);

    const { body: foundSpecifications } = await request(app.getHttpServer())
      .get("/specifications")
      .query({ _order: SortingOrder.DESC })
      .send()
      .expect(HttpStatus.OK);

    expect(foundSpecifications).toHaveProperty("data");
    expect(foundSpecifications).toHaveProperty("meta");
    expect(foundSpecifications).toHaveProperty("links");
    expect(foundSpecifications.data).toHaveLength(2);
    expect(foundSpecifications.data[0]).toHaveProperty(
      "id",
      secondCreatedSpecification.id,
    );
  });
});
