import express from "express";
import { SearchDto } from "../dtos/search.dto";
import { Websites } from "../websites";
import { AppDataSource } from "../database";
import { Provider } from "../entities/Provider.entity";

const searchRouter = express.Router();

const providerRepositry = AppDataSource.getRepository(Provider);

searchRouter.post("/", async (req, res) => {
  const body = req.body as SearchDto;

  const data = await Websites[body.type].search(body.query);

  const phoneNumbers = data.map((property) => property.phone);

  const savedProviders = await providerRepositry
    .createQueryBuilder("property")
    .where("property.phone IN (:...phoneNumbers)", { phoneNumbers })
    .getMany();

  const savedPhoneNumbers = savedProviders.map((provider) => provider.phone);

  data.forEach((proivder) => {
    proivder.isSaved = savedPhoneNumbers.includes(proivder.phone);
  });

  return res.json(data);
});

export default searchRouter;
