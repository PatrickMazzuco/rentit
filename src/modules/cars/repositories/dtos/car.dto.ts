import { CategoryDTO } from "./category.dto";
import { SpecificationDTO } from "./specification.dto";

export class CarDTO {
  id: string;
  name: string;
  description: string;
  licensePlate: string;
  brand: string;
  dailyRate: number;
  fineAmount: number;
  available: boolean;
  categoryId?: string;
  category?: CategoryDTO;
  specifications?: SpecificationDTO[];
  createdAt: Date;
  updatedAt: Date;
}
