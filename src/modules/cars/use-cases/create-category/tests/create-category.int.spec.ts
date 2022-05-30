import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[POST] /categories", () => {
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

  it("should be able to create a new category", async () => {
    const categoryData = getCreateCategoryDTO();

    const createdCategoryResponse = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    expect(createdCategoryResponse.body).toHaveProperty("id");
    expect(createdCategoryResponse.body).toEqual(
      expect.objectContaining({
        name: categoryData.name,
        description: categoryData.description,
      }),
    );
  });

  it("should not be able to create a category with duplicated name", async () => {
    const categoryData = getCreateCategoryDTO();

    await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const createdCategoryResponse = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(createdCategoryResponse.body).toHaveProperty(
      "message",
      CategoryErrorMessage.ALREADY_EXISTS,
    );
  });
});
