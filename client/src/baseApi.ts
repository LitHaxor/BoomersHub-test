import axios from "axios";
import { BASE_API_URL } from "./constants";

export const baseApi = axios.create({
  baseURL: "http://localhost:4000/api",
});

baseApi.interceptors.request.use(
  (config) => {
    console.log(
      `[REQUEST] ${config.method?.toUpperCase()} - ${
        config.url
      } - ${JSON.stringify(config.data)}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response) => {
    console.log(
      `[RESPONSE] ${response.config.method?.toUpperCase()} - ${
        response.config.url
      } - ${JSON.stringify(response.data)}`
    );
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
