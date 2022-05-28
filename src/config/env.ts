export const getEnvVariables = () => {
  const { PORT, API_PREFIX, NODE_ENV } = process.env;

  const port = Number(PORT ?? 3333);
  const apiPrefix = API_PREFIX ?? "/api/v1";
  const nodeEnv = NODE_ENV ?? "development";

  return { port, apiPrefix, nodeEnv };
};
