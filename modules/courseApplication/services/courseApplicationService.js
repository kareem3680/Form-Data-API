import asyncHandler from "express-async-handler";
import courseApplicationModel from "../models/courseApplicationModel.js";
import ApiError from "../../../utils/apiError.js";
import sendEmail from "../../../utils/sendEmail.js";
import Logger from "../../../utils/loggerService.js";
import { getAllService } from "../../../utils/servicesHandler.js";
import { sanitizeCourseApplication } from "../../../utils/sanitizeData.js";

const logger = new Logger("courseApplication");

// ============================================================
// UTILS: Simple Markdown to lightweight HTML
// ============================================================
function markdownToHtml(text = "") {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/^- (.*)$/gm, "<li>$1</li>"); // lists

  if (html.includes("<li>")) html = `<ul>${html}</ul>`;
  html = html.replace(/\n/g, "<br/>");

  return html;
}

// ============================================================
// CREATE COURSE REGISTRATION
// ============================================================
export const createCourseApplicationService = asyncHandler(async (req) => {
  const { fullName, email, phone, level, hasExperience, goal, source, notes } =
    req.body;

  // Create new course registration
  const application = await courseApplicationModel.create({
    fullName,
    email,
    phone,
    level,
    hasExperience,
    goal,
    source,
    notes,
  });

  // Prepare email content (lightweight & clean)
  const messageContent = `
Hello ${fullName},

Thank you for registering in the Frontend Engineer Crash Course by YouTurkeyTech.

In this course, you will learn:
- Web development fundamentals
- Modern frontend technologies
- How to build real-world projects for your portfolio
- Best practices for jobs or freelancing

Our team will contact you soon with full details about the schedule and attendance.

Best regards,  
YouTurkeyTech Team
  `.trim();

  // Send confirmation email asynchronously (fire-and-forget)
  sendEmail({
    email,
    subject: "Frontend Engineer Crash Course Registration Confirmation",
    message: messageContent,
  }).catch((err) =>
    logger.error("Email sending failed", { error: err.message }),
  );

  await logger.info(
    `New course registration submitted by ${fullName} (${email})`,
  );

  return sanitizeCourseApplication(application);
});

// ============================================================
// GET ALL COURSE REGISTRATIONS (ADMIN)
// ============================================================
export const getAllCourseApplicationsService = asyncHandler(async (req) => {
  const result = await getAllService(
    courseApplicationModel,
    req.query,
    "courseApplication",
    {},
    {
      populate: [{ path: "reviewedBy", select: "name jobId" }],
    },
  );

  result.data = result.data.map((app) => sanitizeCourseApplication(app));

  await logger.info(`Loaded ${result.results} course registrations`);
  return result;
});

// ============================================================
// UPDATE COURSE REGISTRATION STATUS (ADMIN)
// ============================================================
export const updateCourseApplicationStatusService = asyncHandler(
  async (req) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const allowedStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowedStatuses.includes(status))
      throw new ApiError("Invalid status value", 400);

    const updatedApp = await courseApplicationModel.findByIdAndUpdate(
      id,
      { status, reviewedBy: userId },
      { new: true },
    );

    if (!updatedApp) throw new ApiError("Application not found", 404);

    await logger.info(`Course registration ${id} updated to ${status}`);
    return sanitizeCourseApplication(updatedApp);
  },
);
