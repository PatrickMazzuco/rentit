import { getEnvVariables } from "@config/env";
import axios from "axios";

export const getAxiosHttpClient = () => {
  const { port, apiPrefix } = getEnvVariables();

  return axios.create({
    baseURL: `http://localhost:${port}${apiPrefix}`,
    validateStatus: () => true,
  });
};
