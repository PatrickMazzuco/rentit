import { CategoryDTO } from "./category.dto";

export type CreateCategoryDTO = Pick<CategoryDTO, "name" | "description">;
