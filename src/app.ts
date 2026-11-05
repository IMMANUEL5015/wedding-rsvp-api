import express from 'express';
import type { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import path from "path";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import AppError from './helpers/AppError';
import {errorResponse} from './helpers/responses'
import statusCodes from './helpers/statusCodes';
import router from './routes';

const app: Express = express();

app.use(cors());
app.use(helmet());
app.set("trust proxy", 1);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(mongoSanitize());
app.use(hpp());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/v1', router);

app.use(async (req: Request, res: Response) => {
  return await errorResponse(
      req, res, new AppError("Resource not found", statusCodes.notFound)
    );
});

app.use(async (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return await errorResponse(req, res, error);
  }

  // Body-parser errors (malformed JSON, payload too large) carry a 4xx status.
  const status = (error as { status?: number })?.status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return await errorResponse(
      req, res, new AppError('Invalid request body', status)
    );
  }

  // Anything else is unexpected: log it, but never leak internals to the client.
  console.error(error);
  return await errorResponse(
    req, res,
    new AppError('Something went wrong. Please try again later.', statusCodes.serverError)
  );
});

export default app;