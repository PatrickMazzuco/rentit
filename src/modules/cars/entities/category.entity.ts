import { uuidV4 } from "@utils/misc/uuid";
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("categories")
export class Category {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  description: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}
