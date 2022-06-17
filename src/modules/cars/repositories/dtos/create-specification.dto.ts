import { SpecificationDTO } from "./specification.dto";

export type CreateSpecificationDTO = Pick<
  SpecificationDTO,
  "name" | "description"
>;
