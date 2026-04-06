import { Router } from "express";
const router = Router();

import {
  createCourseApplication,
  getAllCourseApplications,
  updateCourseApplicationStatus,
} from "../controllers/courseApplicationController.js";

import {
  createCourseApplicationValidator,
  updateCourseApplicationStatusValidator,
} from "../validators/courseApplicationValidator.js";

import {
  protect,
  allowedTo,
} from "../../identity/controllers/authController.js";

router
  .route("/")
  .post(createCourseApplicationValidator, createCourseApplication)
  .get(protect, allowedTo("admin"), getAllCourseApplications);

router
  .route("/status/:id")
  .patch(
    protect,
    allowedTo("admin"),
    updateCourseApplicationStatusValidator,
    updateCourseApplicationStatus,
  );

export default router;
