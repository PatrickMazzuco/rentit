import { Request, Response } from "express";

import { CreateCategoryService } from "./create-category.service";
import { CreateCategoryDTO } from "./dtos/create-categoty.dto";

export class CreateCategoryController {
  constructor(private readonly createCategoryService: CreateCategoryService) {}

  async handle(req: Request, res: Response): Promise<void> {
    const data: CreateCategoryDTO = req.body;

    const category = await this.createCategoryService.execute(data);

    res.status(201).json(category);
  }
}
