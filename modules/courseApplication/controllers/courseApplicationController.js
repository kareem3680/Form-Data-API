import asyncHandler from "express-async-handler";
import {
  createCourseApplicationService,
  getAllCourseApplicationsService,
  updateCourseApplicationStatusService,
} from "../services/courseApplicationService.js";

export const createCourseApplication = asyncHandler(async (req, res) => {
  const app = await createCourseApplicationService(req);
  res.status(201).json({
    message: "Application submitted successfully",
    data: app,
  });
});

export const getAllCourseApplications = asyncHandler(async (req, res) => {
  const result = await getAllCourseApplicationsService(req);
  res.status(200).json({
    message: "Job applications retrieved successfully",
    results: result.results,
    data: result.data,
    paginationResult: result.paginationResult,
  });
});

export const updateCourseApplicationStatus = asyncHandler(async (req, res) => {
  const updated = await updateCourseApplicationStatusService(req);
  res.status(200).json({
    message: "Application status updated successfully",
    data: updated,
  });
});
