import { port, apiPrefix } from "@config/dotenv";
import axios from "axios";

export const axiosHttpClient = axios.create({
  baseURL: `http://localhost:${port}${apiPrefix}`,
  validateStatus: () => true,
});
