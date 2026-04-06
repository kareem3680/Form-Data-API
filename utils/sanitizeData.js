const sanitizeObject = (obj, fields) => {
  return Object.fromEntries(
    fields
      .map(([key, valueFn]) => {
        try {
          const value = valueFn(obj);
          return value !== undefined ? [key, value] : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean),
  );
};

export function sanitizeUser(user) {
  return sanitizeObject(user, [
    ["id", (u) => u._id],
    ["name", (u) => u.name],
    ["email", (u) => u.email],
    ["phone", (u) => u.phone],
    ["active", (u) => u.active],
    ["role", (u) => u.role],
    ["position", (u) => u.position],
    ["jobId", (u) => u.jobId],
    ["hireDate", (u) => u.hireDate],
  ]);
}

export function sanitizeCourseApplication(application) {
  return sanitizeObject(application, [
    ["id", (a) => a._id],
    ["fullName", (a) => a.fullName],
    ["email", (a) => a.email],
    ["phone", (a) => a.phone],
    ["level", (a) => a.level],
    ["hasExperience", (a) => a.hasExperience],
    ["goal", (a) => a.goal],
    ["source", (a) => a.source],
    ["notes", (a) => a.notes],
    ["status", (a) => a.status],
    [
      "reviewedBy",
      (a) =>
        a.reviewedBy
          ? `${a.reviewedBy.name}${
              a.reviewedBy.jobId ? " (" + a.reviewedBy.jobId + ")" : ""
            }`
          : undefined,
    ],
    ["createdAt", (a) => a.createdAt],
    ["updatedAt", (a) => a.updatedAt],
  ]);
}
