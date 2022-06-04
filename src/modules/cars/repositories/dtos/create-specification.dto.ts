import { SpecificationDTO } from "./specification.dto";

export type CreateSpecificationDTO = Omit<
  SpecificationDTO,
  "id" | "createdAt" | "updatedAt"
>;
