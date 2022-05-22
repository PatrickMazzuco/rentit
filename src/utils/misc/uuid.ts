import crypto from "crypto";

export function uuidV4(): string {
  return crypto.randomUUID();
}
