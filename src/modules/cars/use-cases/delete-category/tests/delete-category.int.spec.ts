import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[DELETE] /categories/{id}", () => {
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

  it("should be able to delete a category", async () => {
    const categoryData = getCreateCategoryDTO();

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .delete(`/categories/${createdCategory.id}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/categories/${createdCategory.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it("should not return error when deleting an inexistent category", async () => {
    const id = uuidV4();

    await request(app.getHttpServer())
      .delete(`/categories/${id}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/categories/${id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
