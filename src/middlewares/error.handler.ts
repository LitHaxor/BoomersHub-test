import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorId = Math.random().toString(36).substring(7);
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: err.statusCode,
            errors: err.errors,
            stack: err.stack,
            errorId,
          },
          null,
          2
        )
      );
    }

    return res.status(statusCode).send({ message: errors, errorId });
  }

  console.error(JSON.stringify(err, null, 2));
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }], errorId });
};
