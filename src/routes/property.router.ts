import express, { Request, Response, NextFunction } from "express";
import { Property } from "../entities/Property.entity";
import { AppDataSource } from "../database";

const propertyRouter = express.Router();
const propertyRepository = AppDataSource.getRepository(Property);

interface CustomRequest extends Request {
  property?: Property;
}

const findPropertyById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const property = await propertyRepository.findOne({
    where: { id: parseInt(id) },
  });

  if (!property) {
    res.status(404).json({ message: "Property not found" });
  }

  req.property = property ? property : undefined;
  next();
};

propertyRouter.get("/", async (_, res) => {
  const properties = await propertyRepository.find();
  res.json(properties);
});

propertyRouter.post("/", async (req, res) => {
  const propertyData = req.body as Property;
  const newProperty = await propertyRepository.save(propertyData);
  res.json({ message: "Property created successfully", property: newProperty });
});

propertyRouter.get("/:id", findPropertyById, (req: CustomRequest, res) => {
  res.json(req.property);
});

propertyRouter.put(
  "/:id",
  findPropertyById,
  async (req: CustomRequest, res) => {
    const updatedPropertyData = { ...req.property, ...req.body };
    const updatedProperty = await propertyRepository.save(updatedPropertyData);
    res.json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  }
);

propertyRouter.delete(
  "/:id",
  findPropertyById,
  async (req: CustomRequest, res) => {
    await propertyRepository.delete({
      id: req.property?.id,
    });
    res.json({ message: "Property deleted successfully" });
  }
);

export default propertyRouter;
