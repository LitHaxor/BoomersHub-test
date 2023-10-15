import { PORT } from "./configs";
import cors from "cors";
import express from "express";
import { setupDatabase } from "./database";
import searchRouter from "./routes/search.router";
import providerRouter from "./routes/provider.router";
import imagesRouter from "./routes/images.router";
import { errorHandler } from "./middlewares/error.handler";
import "express-async-errors";

async function bootstrap() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/search", searchRouter);
  app.use("/api/providers", providerRouter);
  app.use("/api/images", imagesRouter);

  await setupDatabase();

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
});
