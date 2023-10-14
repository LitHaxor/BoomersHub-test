import { PORT } from "./configs";
import express from "express";
import { setupDatabase } from "./database";
import searchRouter from "./routes/search.router";
import propertyRouter from "./routes/property.router";
import imagesRouter from "./routes/images.router";

async function bootstrap() {
  const app = express();
  await setupDatabase();

  app.use(express.json());

  app.use("/api/search", searchRouter);
  app.use("/api/property", propertyRouter);
  app.use("/api/images", imagesRouter);

  app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  });
}

bootstrap();
