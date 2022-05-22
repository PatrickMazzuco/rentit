import { uuidV4 } from "@utils/misc/uuid";

export class Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}
