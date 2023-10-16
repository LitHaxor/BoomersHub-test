import express from "express";
import { SearchDto } from "../dtos/search.dto";
import { Websites } from "../websites";
import { AppDataSource } from "../database";
import { Provider } from "../entities/Provider.entity";

const searchRouter = express.Router();

const providerRepositry = AppDataSource.getRepository(Provider);

searchRouter.post("/", async (req, res) => {
  try {
    const body = req.body as SearchDto;

    const data = (await Websites[body.type].search(body.query)) || [];

    const phoneNumbers = [] as string[];

    for (const provider of data) {
      const { phone } = provider;
      if (phone && phone.length > 0) {
        phoneNumbers.push(phone);
      }
    }

    const savedProviders = await providerRepositry
      .createQueryBuilder("property")
      .where("property.phone IN (:...phoneNumbers)", { phoneNumbers })
      .getMany();

    const savedPhoneNumbers = savedProviders.map((provider) => provider.phone);

    data.forEach((proivder) => {
      proivder.isSaved = savedPhoneNumbers.includes(proivder.phone);
    });

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", data: [] });
  }
});

export default searchRouter;
