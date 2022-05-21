import { CategoryDTO } from "./category.dto";

export type CreateCategoryDTO = Omit<
  CategoryDTO,
  "id" | "createdAt" | "updatedAt"
>;
