import { body } from "express-validator";
import { RELATIONSHIPS } from "../../database/models/guest";

export const MAX_COMPANIONS = 10;

// Letters (any language), spaces, hyphens, apostrophes and periods.
const NAME_PATTERN = /^[\p{L}\s'.-]+$/u;

const nameField = (path: string, label: string) =>
  body(path)
    .exists({ values: "falsy" })
    .withMessage(`${label} is required`)
    .bail()
    .isString()
    .withMessage(`${label} must be a string`)
    .bail()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`${label} must be between 1 and 50 characters`)
    .bail()
    .matches(NAME_PATTERN)
    .withMessage(`${label} contains invalid characters`);

export const reserveSeatValidation = () => [
  nameField("firstName", "First name"),
  nameField("lastName", "Last name"),

  body("relationship")
    .isString()
    .bail()
    .trim()
    .isIn(RELATIONSHIPS)
    .withMessage(`Relationship is required and must be one of: ${RELATIONSHIPS.join(", ")}`),

  body("guests")
    .optional()
    .isArray({ max: MAX_COMPANIONS })
    .withMessage(`Guests must be an array of at most ${MAX_COMPANIONS} people`),

  nameField("guests.*.firstName", "Guest first name"),
  nameField("guests.*.lastName", "Guest last name"),
];
