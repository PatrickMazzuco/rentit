import { setupGlobalFilters, setupGlobalPipes } from "@config/globals";
import { IUsersRepository } from "@modules/accounts/repositories/users-repository.interface";
import { CarsModule } from "@modules/cars/cars.module";
import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { ClearDatabase } from "@modules/database/clear-database";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { getCreateUserDTO } from "@utils/tests/mocks/accounts";
import { getCreateCategoryDTO } from "@utils/tests/mocks/cars";
import * as request from "supertest";

describe("[GET] /categories", () => {
  let app: INestApplication;

  let clearDatabase: ClearDatabase;
  let usersRepository: IUsersRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarsModule],
    }).compile();

    clearDatabase = moduleRef.get<ClearDatabase>(ClearDatabase);
    usersRepository = await moduleRef.resolve<IUsersRepository>(
      RepositoryToken.USERS_REPOSITORY,
    );

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

  const setupTestData = async ({ isUserAdmin = true }) => {
    // Create a user
    const userData = getCreateUserDTO();

    const { body: createdUser } = await request(app.getHttpServer())
      .post("/users")
      .send(userData)
      .expect(HttpStatus.CREATED);

    await usersRepository.update({
      ...createdUser,
      isAdmin: true,
    });

    const user = {
      email: userData.email,
      username: userData.username,
      password: userData.password,
    };

    // Authenticate user
    const { body: authResponse } = await request(app.getHttpServer())
      .post("/auth")
      .send({
        login: userData.email,
        password: userData.password,
      });

    // Create categories
    const categoryData = { ...getCreateCategoryDTO(), name: "Category 1" };
    const secondCategory = { ...getCreateCategoryDTO(), name: "Category 2" };

    const { body: createdCategory } = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(categoryData)
      .expect(HttpStatus.CREATED);

    const { body: createdSecondCategory } = await request(app.getHttpServer())
      .post("/categories")
      .set("Authorization", `Bearer ${authResponse.accessToken}`)
      .send(secondCategory)
      .expect(HttpStatus.CREATED);

    const categories: CategoryDTO[] = [createdCategory, createdSecondCategory];

    // Remove admin role from user before returning
    if (!isUserAdmin) {
      await usersRepository.update({
        ...createdUser,
        isAdmin: false,
      });
    }

    return {
      user,
      categories,
      accessToken: authResponse.accessToken,
    };
  };

  it("should be able to list categories", async () => {
    const { categories } = await setupTestData({ isUserAdmin: true });

    const { body: foundCategories } = await request(app.getHttpServer())
      .get("/categories")
      .send()
      .expect(HttpStatus.OK);

    expect(foundCategories).toHaveProperty("data");
    expect(foundCategories).toHaveProperty("meta");
    expect(foundCategories).toHaveProperty("links");
    expect(foundCategories.data).toHaveLength(2);
    expect(foundCategories.data[0]).toHaveProperty("id", categories[0].id);
  });

  it("should be able to list categories with filters", async () => {
    const { categories } = await setupTestData({ isUserAdmin: true });

    const { body: foundCategories } = await request(app.getHttpServer())
      .get("/categories")
      .query({ _order: SortingOrder.DESC })
      .send()
      .expect(HttpStatus.OK);

    expect(foundCategories).toHaveProperty("data");
    expect(foundCategories).toHaveProperty("meta");
    expect(foundCategories).toHaveProperty("links");
    expect(foundCategories.data).toHaveLength(2);
    expect(foundCategories.data[0]).toHaveProperty("id", categories[1].id);
  });
});
