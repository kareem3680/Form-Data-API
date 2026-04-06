import courseApplicationRoutes from "./courseApplication.js";

export const mountRoutes = (app) => {
  app.use("/api/v1/course-applications", courseApplicationRoutes);
};

export default mountRoutes;
