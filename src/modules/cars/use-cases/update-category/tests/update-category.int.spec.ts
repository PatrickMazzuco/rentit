import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[PUT] /categories/{id}", () => {
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

  it("should be able to update a category", async () => {
    const categoryData = getCreateCategoryDTO();

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const updatedCategoryData = {
      name: "Updated Category",
      description: "Updated Description",
    };

    await request(app.getHttpServer())
      .put(`/categories/${createdCategory.id}`)
      .send(updatedCategoryData)
      .expect(HttpStatus.NO_CONTENT);

    const { body: foundCategory } = await request(app.getHttpServer())
      .get(`/categories/${createdCategory.id}`)
      .expect(HttpStatus.OK);

    expect(foundCategory).toHaveProperty("id", createdCategory.id);
    expect(foundCategory).toEqual(
      expect.objectContaining({
        name: updatedCategoryData.name,
        description: updatedCategoryData.description,
      }),
    );
  });

  it("should not be able to update a category to have a duplicated name", async () => {
    const categoryData = getCreateCategoryDTO();

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const updatedCategoryData = {
      name: "Updated Category",
      description: "Updated Description",
    };

    await request(app.getHttpServer())
      .post("/categories")
      .send(updatedCategoryData)
      .expect(HttpStatus.CREATED);

    const { body: updatedCategory } = await request(app.getHttpServer())
      .put(`/categories/${createdCategory.id}`)
      .send(updatedCategoryData)
      .expect(HttpStatus.BAD_REQUEST);

    expect(updatedCategory).toHaveProperty(
      "message",
      CategoryErrorMessage.ALREADY_EXISTS,
    );
  });

  it("should not be able to update an inexistent category", async () => {
    const updatedCategoryData = {
      name: "Updated Category",
      description: "Updated Description",
    };

    const { body: updatedCategory } = await request(app.getHttpServer())
      .put(`/categories/${uuidV4()}`)
      .send(updatedCategoryData)
      .expect(HttpStatus.NOT_FOUND);

    expect(updatedCategory).toHaveProperty(
      "message",
      CategoryErrorMessage.NOT_FOUND,
    );
  });
});
