import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryErrorMessage } from "@modules/cars/errors/category-error-messages.enum";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /categories/{id}", () => {
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

  it("should be able to find an existing category", async () => {
    const categoryData = getCreateCategoryDTO();

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const { body: foundCategory } = await request(app.getHttpServer())
      .get(`/categories/${createdCategory.id}`)
      .expect(HttpStatus.OK);

    expect(foundCategory).toHaveProperty("id", createdCategory.id);
    expect(foundCategory).toEqual(
      expect.objectContaining({
        name: createdCategory.name,
        description: createdCategory.description,
      }),
    );
  });

  it("should not be able to find an inexistent category", async () => {
    const { body: foundCategory } = await request(app.getHttpServer())
      .get(`/categories/${uuidV4()}`)
      .expect(HttpStatus.NOT_FOUND);

    expect(foundCategory).toHaveProperty(
      "message",
      CategoryErrorMessage.NOT_FOUND,
    );
  });
});
