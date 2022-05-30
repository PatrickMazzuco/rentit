export const getEnvVariables = () => {
  const { PORT, API_PREFIX, NODE_ENV } = process.env;

  const parsedVariables = {
    port: Number(PORT ?? 3333),
    apiPrefix: API_PREFIX ?? "/api/v1",
    nodeEnv: NODE_ENV ?? "development",
  };

  return parsedVariables;
};

export const getEnvFilename = (nodeEnv?: string) => {
  const env = nodeEnv ?? process.env.NODE_ENV ?? "development";

  return `.env.${env}.local`;
};

export const getEnvPaginationOptions = () => {
  const { DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } = process.env;

  const parsedVariables = {
    defaultPaginationLimit: Number(DEFAULT_PAGINATION_LIMIT ?? 10),
    maxPaginationLimit: Number(MAX_PAGINATION_LIMIT ?? 100),
  };

  return parsedVariables;
};
