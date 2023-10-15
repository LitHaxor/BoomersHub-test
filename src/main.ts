import { PORT } from "./configs";
import cors from "cors";
import express from "express";
import { setupDatabase } from "./database";
import searchRouter from "./routes/search.router";
import providerRouter from "./routes/property.router";
import imagesRouter from "./routes/images.router";

async function bootstrap() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/search", searchRouter);
  app.use("/api/providers", providerRouter);
  app.use("/api/images", imagesRouter);

  await setupDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
});
