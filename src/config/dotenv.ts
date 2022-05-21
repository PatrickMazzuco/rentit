import "dotenv/config";

const { PORT, API_PREFIX } = process.env;

const port = PORT ?? 3333;
const apiPrefix = API_PREFIX ?? "/api/v1";

export { port, apiPrefix };
