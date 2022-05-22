import "dotenv/config";

const {
  PORT,
  API_PREFIX,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOSTNAME,
  DB_PORT,
} = process.env;

const port = Number(PORT ?? 3333);
const apiPrefix = API_PREFIX ?? "/api/v1";

const databaseConfig = {
  username: String(DB_USERNAME),
  password: String(DB_PASSWORD),
  database: String(DB_NAME),
  host: String(DB_HOSTNAME),
  port: Number(DB_PORT ?? 5432),
};

export { port, apiPrefix, databaseConfig };
