import express, { Router } from "express";

import { ICategoriesRepository } from "../../repositories/categories-repository.interface";
import { PrismaCategoriesRepository } from "../../repositories/prisma/prisma-categories.repository";
import { CreateCategoryController } from "./create-category.controller";
import { CreateCategoryService } from "./create-category.service";

const router: Router = express.Router();

const categoryRepository: ICategoriesRepository =
  new PrismaCategoriesRepository();

const createCategoryService = new CreateCategoryService(categoryRepository);
const createCategoryController = new CreateCategoryController(
  createCategoryService,
);

router.post("", (req, res) => createCategoryController.handle(req, res));

export default router;
