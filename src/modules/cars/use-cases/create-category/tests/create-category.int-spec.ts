import "reflect-metadata";

import { startHttpServer } from "@src/server";
import { uuidV4 } from "@src/utils/misc/uuid";
import { ClearDatabase } from "@src/utils/tests/clear-database";
import { axiosHttpClient } from "@src/utils/tests/http-client";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import { Server } from "http";
import { describe, it, before, after } from "mocha";
import sinon from "sinon";
import { container } from "tsyringe";

chai.use(chaiSubset);
chai.use(chaiAsPromised);
const { expect } = chai;

let httpServer: Server;
let clearDatabase: ClearDatabase;

before(async () => {
  httpServer = startHttpServer();
  clearDatabase = container.resolve(ClearDatabase);
});

beforeEach(async () => {
  await clearDatabase.execute();
});

afterEach(() => {
  sinon.restore();
});

after(() => {
  httpServer.close();
});

describe("POST /categories", () => {
  it("should be able to create a new category", async () => {
    const categoryData = {
      id: uuidV4(),
      name: "SUV",
      description: "Descrição da categoria SUV",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { name, description } = categoryData;

    const createdCategory = await axiosHttpClient.post("/categories", {
      name,
      description,
    });

    expect(createdCategory.data).to.haveOwnProperty("id");
  });

  it("should not be able to create a category with duplicated name", async () => {
    const categoryData = {
      id: uuidV4(),
      name: "SUV",
      description: "Descrição da categoria SUV",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { name, description } = categoryData;

    await axiosHttpClient.post("/categories", {
      name,
      description,
    });

    const response = await axiosHttpClient.post("/categories", {
      name,
      description,
    });

    expect(response.status).to.equal(400);
    expect(response.data).to.have.property(
      "message",
      "Category already exists",
    );
  });
});
