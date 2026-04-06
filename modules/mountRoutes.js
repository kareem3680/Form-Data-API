import mountRoutesIdentity from "./identity/routes/index.js";
import mountRoutesCourseApplication from "./courseApplication/routes/index.js";

export default function mountRoutes(app) {
  mountRoutesIdentity(app);
  mountRoutesCourseApplication(app);
}
