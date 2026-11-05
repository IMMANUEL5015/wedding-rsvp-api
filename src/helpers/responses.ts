/* eslint-disable no-undef */
import { config } from 'dotenv';
config();

import type {Response} from 'express';
import AppError from './AppError';
import Log from '../database/models/log';
import { AuthRequest, SuccessData } from './types';

export const errorResponse = async (
  req: AuthRequest, res: Response, error: AppError
) => {
  if (process.env.NODE_ENV === "dev") {
    console.log(error);
  }

  const incomingData = {...req.params, ...req.query, ...req.body};
  delete incomingData.password;
  delete incomingData.apiKey

  Log.create({
    user: req.user?._id,
    data: incomingData,
    url: req.originalUrl,
    response: error,
    userType: req.userType || 'User',
    success: false
  }).catch((err: unknown) => console.error("Failed to write error log:", err));

  return res.status(error.statusCode).json({
    status: error.status || "fail",
    message: error.message || "Internal Server Error",
    data: error.data || {},
  });
};

export const successResponse = (
  req: AuthRequest,
  res: Response,
  success: SuccessData
) => {

    const incomingData = {...req.params, ...req.query, ...req.body};
    delete incomingData.password;
    delete incomingData.apiKey

  Log.create({
    user: success.user ?? req.user?._id,
    data: incomingData,
    url: req.originalUrl,
    response: success.data,
    endpointName: success.endpointName,
    endpointDescription: success.endpointDescription,
    userType: success.userType ?? req.userType ?? "User",
    success: true,
  }).catch((err: unknown) => console.error("Failed to write success log:", err));

  return res.status(success.statusCode).json({
    status: "success",
    message: success.message || 'Operation completed successfully.',
    data: success.data ?? {},
  });
};
