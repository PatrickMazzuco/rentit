import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCategoryService } from "./create-category.service";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

export class CreateCategoryController {
  async handle(req: Request, res: Response): Promise<void> {
    const createCategoryService = container.resolve(CreateCategoryService);

    const data: CreateCategoryDTO = req.body;

    const category = await createCategoryService.execute(data);

    res.status(201).json(category);
  }
}
