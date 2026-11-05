import type { Request, Response } from "express";
import CatchAsync from "../../helpers/CatchAsync";
import { successResponse } from "../../helpers/responses";
import statusCodes from "../../helpers/statusCodes";
import { getGuestListService, reserveSeatService } from "./services";

export const reserveSeatController = CatchAsync(async (req: Request, res: Response) => {
  const data = await reserveSeatService(req.body);

  return successResponse(req, res, {
    statusCode: data.reserved.length > 0 ? statusCodes.created : statusCodes.ok,
    message: data.message,
    data,
    endpointName: "Reserve Seat",
    endpointDescription: "Reserve wedding seats for a guest and their companions",
  });
});

export const getGuestListController = CatchAsync(async (req: Request, res: Response) => {
  const data = await getGuestListService();

  return successResponse(req, res, {
    statusCode: statusCodes.ok,
    message: "Guest list retrieved successfully.",
    data,
    endpointName: "Get Guest List",
    endpointDescription: "Retrieve all reserved guests and the total count",
  });
});
