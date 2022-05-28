import { randomUUID } from "node:crypto";

export function uuidV4(): string {
  return randomUUID();
}
