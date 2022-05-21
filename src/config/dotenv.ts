import "dotenv/config";

const { PORT } = process.env;

const port = PORT ?? 3333;

export { port };
