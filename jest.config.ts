import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

export default {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/modules/**/use-cases/**/*.ts",
    "!**/dtos/**/*.dto.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "text", "lcov", "clover", "text-summary"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*spec.ts"],
};
