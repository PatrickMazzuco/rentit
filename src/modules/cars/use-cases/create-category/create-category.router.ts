import express, { Router } from "express";

import { CreateCategoryController } from "./create-category.controller";

const router: Router = express.Router();

const createCategoryController = new CreateCategoryController();

router.post("", createCategoryController.handle);

export default router;
