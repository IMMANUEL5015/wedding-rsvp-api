import mongoose, { type InferSchemaType } from "mongoose";

export const RELATIONSHIPS = ["Bride", "Groom"] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

const GuestSchema = new mongoose.Schema(
  {
    // Display name, e.g. "John Doe" (whitespace collapsed and trimmed).
    fullName: { type: String, required: true, trim: true },

    // Lower-cased fullName used for duplicate detection, so that
    // "John Doe" and "john   DOE" are treated as the same guest.
    normalizedName: { type: String, required: true, unique: true },

    relationship: { type: String, required: true, enum: RELATIONSHIPS },

    // Full name of the person who submitted the RSVP for this guest.
    reservedBy: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type GuestDocument = InferSchemaType<typeof GuestSchema>;

const Guest = mongoose.model("Guest", GuestSchema);
export default Guest;
