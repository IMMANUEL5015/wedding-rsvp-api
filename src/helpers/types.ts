import { Request, Response } from "express";
import { Types } from "mongoose";

type Id = Types.ObjectId | string;

export interface AuthRequest extends Request {
  user?: { _id: Id };
  userType?: string;
}

export interface LogMeta {
  user?: Id;
  endpointName?: string;
  endpointDescription?: string;
  userType?: string;
}

export interface SuccessData extends LogMeta{
    statusCode: number;
    message?: string;
    data?: unknown
}

export interface PersonName {
  firstName: string;
  lastName: string;
}

export interface ReserveSeatData extends PersonName {
  relationship: "Bride" | "Groom";
  guests?: PersonName[];
}

export interface ReserveSeatResult {
  message: string;
  reserved: string[];
  alreadyReserved: string[];
}

export interface GuestListResult {
  totalCount: number;
  brideCount: number;
  groomCount: number;
  guests: {
    fullName: string;
    relationship: string;
    reservedBy: string;
    createdAt?: Date;
  }[];
}
