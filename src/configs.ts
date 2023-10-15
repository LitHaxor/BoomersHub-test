import { config } from "dotenv";
config();
export const ENV = process.env.NODE_ENV;
export const PORT: number = Number(process.env.PORT) || 4000;
// AWS
export const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY: string =
  process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_REGION: string = process.env.AWS_REGION || "";
export const AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAME || "";
export const PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";

// mysql
export const MYSQL_HOST: string = process.env.MYSQL_HOST || "";
export const MYSQL_PORT: number = Number(process.env.MYSQL_PORT) || 3306;
export const MYSQL_USER: string = process.env.MYSQL_USER || "";
export const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD || "";
export const MYSQL_DB: string = process.env.MYSQL_DB || "";
// PROXY

export const PROXY_API: string = process.env.PROXY_API || "";
