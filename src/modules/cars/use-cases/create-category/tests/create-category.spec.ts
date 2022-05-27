import "reflect-metadata";

import { BadRequestException } from "@src/errors";
import { ICategoriesRepository } from "@src/modules/cars/repositories/categories-repository.interface";
import { uuidV4 } from "@src/utils/misc/uuid";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import { describe, it } from "mocha";
import sinon from "sinon";

import { CreateCategoryService } from "../create-category.service";

chai.use(chaiSubset);
chai.use(chaiAsPromised);
const { expect } = chai;

const categoryRepository: ICategoriesRepository = {
  create: sinon.fake(),
  findById: sinon.fake(),
  findByName: sinon.fake(),
  truncate: sinon.fake(),
};

afterEach(() => {
  sinon.restore();
});

describe("CreateCategory", () => {
  it("should be able to create a new category", async () => {
    const categoryData = {
      id: uuidV4(),
      name: "SUV",
      description: "Descrição da categoria SUV",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sinon.replace(
      categoryRepository,
      "create",
      sinon.fake.resolves(categoryData),
    );

    const createCategory = new CreateCategoryService(categoryRepository);

    const { name, description } = categoryData;

    const category = await createCategory.execute({
      name,
      description,
    });

    expect(category).to.containSubset(categoryData);
  });

  it("should not be able to create a category with duplicated name", async () => {
    const categoryData = {
      id: uuidV4(),
      name: "SUV",
      description: "Descrição da categoria SUV",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sinon.replace(
      categoryRepository,
      "findByName",
      sinon.fake.resolves(categoryData),
    );

    const createCategory = new CreateCategoryService(categoryRepository);

    const { name, description } = categoryData;

    await expect(
      createCategory.execute({
        name,
        description,
      }),
    ).to.eventually.be.rejectedWith(BadRequestException);
  });
});
