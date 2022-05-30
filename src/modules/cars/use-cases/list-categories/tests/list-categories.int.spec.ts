import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { CarsModule } from "@modules/cars/cars.module";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /categories", () => {
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

  it("should be able to list categories", async () => {
    const categoryData = { ...getCreateCategoryDTO(), name: "Category 1" };
    const secondCategory = { ...getCreateCategoryDTO(), name: "Category 2" };

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post("/categories")
      .send(secondCategory)
      .expect(HttpStatus.CREATED);

    const { body: foundCategories } = await request(app.getHttpServer())
      .get("/categories")
      .send()
      .expect(HttpStatus.OK);

    expect(foundCategories).toHaveProperty("data");
    expect(foundCategories).toHaveProperty("meta");
    expect(foundCategories).toHaveProperty("links");
    expect(foundCategories.data).toHaveLength(2);
    expect(foundCategories.data[0]).toHaveProperty("id", createdCategory.id);
  });

  it("should be able to list categories with filters", async () => {
    const categoryData = { ...getCreateCategoryDTO(), name: "Category 1" };
    const secondCategory = { ...getCreateCategoryDTO(), name: "Category 2" };

    await request(app.getHttpServer())
      .post("/categories")
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const { body: secondCreatedCategory } = await request(app.getHttpServer())
      .post("/categories")
      .send(secondCategory)
      .expect(HttpStatus.CREATED);

    const { body: foundCategories } = await request(app.getHttpServer())
      .get("/categories")
      .query({ _order: SortingOrder.DESC })
      .send()
      .expect(HttpStatus.OK);

    expect(foundCategories).toHaveProperty("data");
    expect(foundCategories).toHaveProperty("meta");
    expect(foundCategories).toHaveProperty("links");
    expect(foundCategories.data).toHaveLength(2);
    expect(foundCategories.data[0]).toHaveProperty(
      "id",
      secondCreatedCategory.id,
    );
  });
});
