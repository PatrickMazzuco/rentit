import { CategoryDTO } from "./category.dto";

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
  createdAt: Date;
  updatedAt: Date;
}
