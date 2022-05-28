import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CarsModule } from "@src/modules/cars/cars.module";
import { CategoryErrorMessage } from "@src/modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@src/modules/database/clear-database";
import { getCreateCategoryDTO } from "@src/utils/tests/mocks/cars";
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

    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase.execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a new category", async () => {
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
