import { CarImageDTO } from "./car-image.dto";
import { CategoryDTO } from "./category.dto";
import { SpecificationDTO } from "./specification.dto";

export type CarDTO = {
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
  images?: CarImageDTO[];
  createdAt: Date;
  updatedAt: Date;
};
