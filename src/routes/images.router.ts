import express from "express";
import { getUploadedImagesFromS3 } from "../libs/aws";

const imagesRouter = express.Router();

imagesRouter.get("/", async (_, res) => {
  const images = await getUploadedImagesFromS3();
  return res.json(images);
});

export default imagesRouter;
