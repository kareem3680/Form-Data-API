import { check } from "express-validator";
import validatorMiddleWare from "../../../middlewares/validatorMiddleware.js";

export const createCourseApplicationValidator = [
  check("fullName").notEmpty().withMessage("Full name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("phone").notEmpty().withMessage("Phone is required"),
  check("level")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),
  check("hasExperience")
    .optional()
    .isBoolean()
    .withMessage("hasExperience must be true or false"),
  check("goal").notEmpty().withMessage("Goal is required"),
  check("source")
    .isIn(["Instagram", "Facebook", "LinkedIn", "Friend", "Other"])
    .withMessage("Source is invalid"),
  check("notes").optional().trim(),
  validatorMiddleWare,
];

export const updateCourseApplicationStatusValidator = [
  check("id").isMongoId().withMessage("Invalid application ID"),
  check("status")
    .notEmpty()
    .isIn(["pending", "reviewed", "accepted", "rejected"])
    .withMessage("Invalid status"),
  validatorMiddleWare,
];
