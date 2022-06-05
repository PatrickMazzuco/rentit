import { Provider } from "@nestjs/common";
import { ProviderToken } from "@shared/enums/provider-token.enum";
import * as bcrypt from "bcrypt";

import { IPasswordHash } from "../password-hash.provider";

export class BCryptPasswordHash implements IPasswordHash {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const BCryptPasswordHashProvider: Provider = {
  provide: ProviderToken.PASSWORD_HASH,
  useClass: BCryptPasswordHash,
};
