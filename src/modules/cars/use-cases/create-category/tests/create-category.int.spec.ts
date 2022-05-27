import { HttpStatus } from "@src/errors";
import { startHttpServer } from "@src/server";
import { ClearDatabase } from "@src/utils/tests/clear-database";
import { axiosHttpClient } from "@src/utils/tests/http-client";
import { getCreateCategoryDTO } from "@src/utils/tests/mocks/cars";
import { Server } from "http";
import { container } from "tsyringe";

let httpServer: Server;
let clearDatabase: ClearDatabase;

beforeAll(async () => {
  httpServer = startHttpServer();
  clearDatabase = container.resolve(ClearDatabase);
});

beforeEach(async () => {
  await clearDatabase.execute();
});

afterAll(() => {
  httpServer.close();
});

describe("POST /categories", () => {
  it("should be able to create a new category", async () => {
    const categoryData = getCreateCategoryDTO();

    const createdCategory = await axiosHttpClient.post("/categories", {
      name: categoryData.name,
      description: categoryData.description,
    });

    expect(createdCategory).toHaveProperty("status", HttpStatus.CREATED);
    expect(createdCategory.data).toHaveProperty("id");
    expect(createdCategory.data).toEqual(
      expect.objectContaining({
        name: categoryData.name,
        description: categoryData.description,
      }),
    );
  });

  it("should not be able to create a category with duplicated name", async () => {
    const categoryData = getCreateCategoryDTO();

    await axiosHttpClient.post("/categories", {
      name: categoryData.name,
      description: categoryData.description,
    });

    const response = await axiosHttpClient.post("/categories", {
      name: categoryData.name,
      description: categoryData.description,
    });

    expect(response).toHaveProperty("status", HttpStatus.BAD_REQUEST);
    expect(response.data).toHaveProperty("message", "Category already exists");
  });
});
