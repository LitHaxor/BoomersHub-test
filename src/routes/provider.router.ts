import express, { Request, Response, NextFunction } from "express";
import { Provider } from "../entities/Provider.entity";
import { AppDataSource } from "../database";
import HttpRequestError from "../errors/HttpRequestError";

const providerRouter = express.Router();
const providerRepository = AppDataSource.getRepository(Provider);

interface CustomRequest extends Request {
  property?: Provider;
}

const findPropertyById = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const provider = await providerRepository.findOne({
    where: { id: parseInt(id) },
  });

  if (!provider) {
    throw new HttpRequestError({
      code: 404,
      message: `Provider with id ${id} not found`,
    });
  }

  req.property = provider ? provider : undefined;
  next();
};

providerRouter.get("/", async (req, res) => {
  try {
    const {
      q,
      limit = 10,
      offset = 0,
    } = req.query as {
      q: string;
      limit: string;
      offset: string;
    };
    const queryOption = providerRepository
      .createQueryBuilder("provider")
      .take(Number(limit || 10))
      .skip(Number(offset || 0));

    if (q) {
      queryOption.andWhere("provider.name ILIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.address ILIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.city ILIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.zip ILIKE :query", { query: `%${q}%` });
      queryOption.orWhere("provider.country ILIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.type ILIKE :query", {
        query: `%${q}%`,
      });
    }

    const [providers, count] = await queryOption.getManyAndCount();

    return res.json({
      providers,
      count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

providerRouter.post("/", async (req, res) => {
  const providerData = req.body as Provider;

  const newProvider = await providerRepository.save(providerData);
  return res.json({
    message: "Provider saved!",
    provider: newProvider,
  });
});

providerRouter.get("/:id", findPropertyById, (req: CustomRequest, res) => {
  res.json(req.property);
});

providerRouter.put(
  "/:id",
  findPropertyById,
  async (req: CustomRequest, res) => {
    const updatedProviderData = { ...req.property, ...req.body };
    const updatedProvider = await providerRepository.save(updatedProviderData);
    res.json({
      message: "Provider updated successfully",
      provider: updatedProvider,
    });
  }
);

providerRouter.delete(
  "/:id",
  findPropertyById,
  async (req: CustomRequest, res) => {
    await providerRepository.delete({
      id: req.property?.id,
    });
    res.json({ message: "Property deleted successfully" });
  }
);

export default providerRouter;
