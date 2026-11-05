import Guest from "../../database/models/guest";
import type { GuestListResult, PersonName, ReserveSeatData, ReserveSeatResult } from "../../helpers/types";

/** Combine first and last name, collapse inner whitespace and trim both ends. */
export const toFullName = ({ firstName, lastName }: PersonName): string =>
  `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();

const normalize = (fullName: string): string => fullName.toLowerCase();

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;

export const reserveSeatService = async (data: ReserveSeatData): Promise<ReserveSeatResult> => {
  const reservedBy = toFullName(data);

  // Primary guest first, then companions; drop duplicates within the same request.
  const unique = new Map<string, string>();
  for (const person of [data, ...(data.guests ?? [])]) {
    const fullName = toFullName(person);
    const key = normalize(fullName);
    if (!unique.has(key)) unique.set(key, fullName);
  }

  const reserved: string[] = [];
  const alreadyReserved: string[] = [];

  // Upsert each guest atomically against the unique index, so concurrent
  // submissions can never create two records for the same name.
  for (const [normalizedName, fullName] of unique) {
    try {
      const result = await Guest.updateOne(
        { normalizedName },
        {
          $setOnInsert: {
            fullName,
            normalizedName,
            relationship: data.relationship,
            reservedBy,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) reserved.push(fullName);
      else alreadyReserved.push(fullName);
    } catch (error) {
      // Lost a race with a simultaneous request for the same name.
      if (isDuplicateKeyError(error)) alreadyReserved.push(fullName);
      else throw error;
    }
  }

  let message: string;
  if (reserved.length === 0) {
    message =
      unique.size === 1
        ? "A seat has already been reserved for you."
        : "Seats have already been reserved for everyone in this request.";
  } else if (alreadyReserved.length === 0) {
    message =
      reserved.length === 1
        ? "Your seat has been reserved successfully."
        : `${reserved.length} seats have been reserved successfully.`;
  } else {
    message =
      `${reserved.length} seat(s) reserved successfully. ` +
      `A seat has already been reserved for: ${alreadyReserved.join(", ")}.`;
  }

  return { message, reserved, alreadyReserved };
};

export const getGuestListService = async (): Promise<GuestListResult> => {
  const guests = await Guest.find({}, { _id: 0, fullName: 1, relationship: 1, reservedBy: 1, createdAt: 1 })
    .sort({ createdAt: 1 })
    .lean();

  const totalCount = guests.length;
  const brideCount = guests.filter((g) => g.relationship === "Bride").length;

  return {
    totalCount,
    brideCount,
    groomCount: totalCount - brideCount,
    guests,
  };
};
