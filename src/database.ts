import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from "./configs";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy(),
});

export async function setupDatabase() {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    throw new Error(`Error while connecting to the database: ${error}`);
  }
}
