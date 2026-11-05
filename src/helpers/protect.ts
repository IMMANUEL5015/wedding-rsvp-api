import { config } from 'dotenv';
config();

import { timingSafeEqual } from 'node:crypto';
import AppError from "./AppError";
import type {Request, Response, NextFunction} from 'express';
import statusCodes from "./statusCodes";
import { errorResponse } from "./responses";

const API_ACCESS_KEY = process.env.API_ACCESS_KEY || '';

const isValidKey = (provided: unknown): boolean => {
    // Deny everything if no key is configured on the server.
    if (!API_ACCESS_KEY || typeof provided !== 'string') return false;

    const a = Buffer.from(provided);
    const b = Buffer.from(API_ACCESS_KEY);
    return a.length === b.length && timingSafeEqual(a, b);
};

export default async(req: Request, res: Response, next: NextFunction) => {
    if (isValidKey(req.headers['api-access-key'])) {
        return next();
    }

    return errorResponse(req, res, new AppError(
        'Please provide a valid api access key',
        statusCodes.forbidden
    ));
}
