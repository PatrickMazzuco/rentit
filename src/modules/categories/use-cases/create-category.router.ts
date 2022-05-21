import express, { Router } from "express";

import { ICategoryRepository } from "../repositories/category-repository.interface";
import { CreateCategoryController } from "./create-category.controller";
import { CreateCategoryService } from "./create-category.service";

const router: Router = express.Router();

const categoryRepository: ICategoryRepository = {
  create: async (data) => {
    return {
      ...data,
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};

const createCategoryService = new CreateCategoryService(categoryRepository);
const createCategoryController = new CreateCategoryController(
  createCategoryService,
);

router.post("", (req, res) => createCategoryController.handle(req, res));

export default router;
