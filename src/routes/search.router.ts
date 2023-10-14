import express from "express";
import { SearchDto } from "../dtos/search.dto";
import { Websites } from "../websites";

const searchRouter = express.Router();

searchRouter.post("/", async (req, res) => {
  const body = req.body as SearchDto;

  const data = await Websites[body.type].search(body.query);

  return res.json(data);
});

export default searchRouter;
