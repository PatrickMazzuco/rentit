import {
  generateRoutes,
  generateSpec,
  ExtendedRoutesConfig,
  ExtendedSpecConfig,
} from "tsoa";

import { apiPrefix } from "./dotenv";

const noImplicitAdditionalProperties:
  | "silently-remove-extras"
  | "throw-on-extras"
  | "ignore" = "silently-remove-extras";

const baseConfig = {
  basePath: apiPrefix,
  entryFile: "./src/main.ts",
  noImplicitAdditionalProperties,
};

const pathConfig = {
  baseUrl: "./src",
  paths: {
    "@src/*": ["*"],
    "@modules/*": ["modules/*"],
    "@config/*": ["config/*"],
    "@shared/*": ["shared/*"],
    "@middlewares/*": ["middlewares/*"],
    "@errors/*": ["errors/*"],
    "@utils/*": ["utils/*"],
  },
};

export const initializeRoutes = async () => {
  const routeOptions: ExtendedRoutesConfig = {
    ...baseConfig,
    routesDir: "src/routes",
  };

  await generateRoutes(routeOptions, pathConfig);
};

export const generateSwaggerSpec = async () => {
  const specOptions: ExtendedSpecConfig = {
    ...baseConfig,
    specVersion: 3,
    outputDirectory: "dist/routes",
    controllerPathGlobs: ["src/**/*.controller.ts"],
  };

  await generateSpec(specOptions, pathConfig);
};
