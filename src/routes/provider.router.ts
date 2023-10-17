import express, { Request, Response, NextFunction } from "express";
import { Provider } from "../entities/Provider.entity";
import { AppDataSource } from "../database";
import { getLatLong } from "../libs/geo";

const providerRouter = express.Router();
const providerRepository = AppDataSource.getRepository(Provider);

interface CustomRequest extends Request {
  property?: Provider;
}

const findPropertyById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const provider = await providerRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!provider) {
      res.status(404).json({ message: "Provider not found" });
    }

    req.property = provider ? provider : undefined;
    next();
  } catch (error) {
    next(error);
  }
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
      .orderBy("provider.created_at", "DESC")
      .take(Number(limit || 10))
      .skip(Number(offset || 0));

    if (q) {
      queryOption.andWhere("provider.name LIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.address LIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.city LIKE :query", {
        query: `%${q}%`,
      });
      queryOption.orWhere("provider.state LIKE :query", { query: `%${q}%` });
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
  try {
    const providerData = req.body as Provider;

    if (!providerData) {
      return res.status(400).json({ message: "No provider provided" });
    }

    if (!providerData.latitude || !providerData.longitude) {
      const data = await getLatLong(
        providerData.address,
        providerData.city,
        providerData.state
      );

      if (data) {
        providerData.latitude = data.latitude;
        providerData.longitude = data.longitude;
      }
    }

    const newProvider = await providerRepository.save(providerData);

    return res.json({
      message: "Provider saved!",
      provider: newProvider,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

providerRouter.post("/bulk", async (req, res) => {
  try {
    const providers = req.body.providers as Provider[];
    if (!providers || providers.length === 0) {
      return res.status(400).json({ message: "No providers provided" });
    }

    const existing = 0;
    const newProviders = 0;
    const requested = providers.length;

    for await (const provider of providers as Provider[]) {
      const existingProvider = await providerRepository.findOne({
        where: { phone: provider.phone },
      });
      if (existingProvider) {
        continue;
      }

      if (!provider.latitude || !provider.longitude) {
        const data = await getLatLong(
          provider.address,
          provider.city,
          provider.state
        );

        if (data) {
          provider.latitude = data.latitude;
          provider.longitude = data.longitude;
        }
      }

      await providerRepository.save(provider);
    }
    return res.status(201).json({
      message: "Providers saved successfully",
      existing,
      newProviders,
      requested,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while saving bulk" });
  }
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
