import type { Request, Response, NextFunction, RequestHandler } from "express";
import {
  validationResult,
  matchedData,
  type ValidationChain,
  type ValidationError,
  type Location,
} from "express-validator";
import statusCodes from "./statusCodes";
import AppError from "./AppError";

type FieldErrorMap = Record<string, string>;

const toFieldError = (err: ValidationError): FieldErrorMap => {
  switch (err.type) {
    case "field":
      return { [err.path]: String(err.msg) };
    case "unknown_fields":
      return { [err.fields.map((f) => f.path).join(", ")]: String(err.msg) };
    default: // "alternative" | "alternative_grouped"
      return { _error: String(err.msg) };
  }
};

const validate = (chains: ValidationChain[]): RequestHandler[] => {
  // Computed once at setup, not on every request
  const usedLocations: Location[] = [
    ...new Set(chains.flatMap((chain) => chain.builder.build().locations)),
  ];

  return [
    ...chains,
    (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(toFieldError);
        const [key, msg] = Object.entries(extractedErrors[0])[0];
        const message = `${msg}. Please enter a valid ${key}`;

        return next(
          new AppError(message, statusCodes.unprocessableEntity, extractedErrors)
        );
      }

      // Replace each location with only the validated fields
      usedLocations.forEach((location) => {
        Object.defineProperty(req, location, {
          value: matchedData(req, { locations: [location] }),
          writable: true,
          configurable: true,
          enumerable: true,
        });
      });

      return next();
    },
  ];
};

export default validate;