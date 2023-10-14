import { PORT } from "./configs";
import express from "express";
import { setupDatabase } from "./database";
import searchRouter from "./routes/search.router";

async function bootstrap() {
  const app = express();
  await setupDatabase();

  app.use(express.json());

  app.use("/api/search", searchRouter);

  app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  });
}

bootstrap();
