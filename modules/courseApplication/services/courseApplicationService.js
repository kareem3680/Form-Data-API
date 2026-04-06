import asyncHandler from "express-async-handler";
import courseApplicationModel from "../models/courseApplicationModel.js";
import ApiError from "../../../utils/apiError.js";
import sendEmail from "../../../utils/sendEmail.js";
import Logger from "../../../utils/loggerService.js";
import { getAllService } from "../../../utils/servicesHandler.js";
import { sanitizeCourseApplication } from "../../../utils/sanitizeData.js";

const logger = new Logger("courseApplication");

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

  // Send confirmation email in Arabic
  sendEmail({
    email,
    subject: `تأكيد التسجيل في كورس Frontend Engineer Crash Course`,
    message: `
مرحبًا عزيزي/عزيزتي ${fullName}،

نشكرك على تسجيلك في كورس **Frontend Engineer Crash Course** المقدم من أكاديمية **YouTurkeyTech**.

يسعدنا انضمامك إلينا، ونتطلع لمساعدتك في تطوير مهاراتك في مجال تطوير الواجهات الأمامية (Frontend) والوصول إلى أهدافك المهنية.

خلال هذا الكورس، ستتعلم:
- أساسيات تطوير الويب بشكل احترافي
- تقنيات Frontend الحديثة المطلوبة في سوق العمل
- كيفية بناء مشاريع عملية تضيفها إلى معرض أعمالك (Portfolio)
- أفضل الممارسات التي تؤهلك للحصول على فرص عمل أو بدء العمل الحر

سيقوم فريقنا بالتواصل معك قريبًا لتأكيد التفاصيل الكاملة الخاصة بموعد بدء الكورس وطريقة الحضور.

إذا كان لديك أي استفسار، لا تتردد في التواصل معنا في أي وقت.

نتمنى لك رحلة تعليمية ممتعة ومثمرة 

مع أطيب التحيات،
فريق أكاديمية YouTurkeyTech
    `.trim(),
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

  // Sanitize all returned applications
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
