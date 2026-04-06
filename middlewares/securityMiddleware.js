import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import compression from "compression";
import sanitizeHtml from "sanitize-html";

// Generic sanitize function for input objects
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const sanitized = {};
  for (const key in obj) {
    if (obj[key] != null) {
      if (typeof obj[key] === "string") {
        sanitized[key] = sanitizeHtml(obj[key], {
          allowedTags: [], // Remove all HTML
          allowedAttributes: {},
        });
      } else if (typeof obj[key] === "object") {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  return sanitized;
};

export default (app) => {
  // Security Headers
  app.use(helmet());

  // Prevent parameter pollution
  app.use(hpp());

  // Clean MongoDB injections + sanitize input
  app.use((req, res, next) => {
    req.body = sanitizeObject(mongoSanitize(req.body));
    req.params = sanitizeObject(mongoSanitize(req.params));
    req.cleanedQuery = sanitizeObject(mongoSanitize(req.query));
    next();
  });

  // Apply rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 250,
    message: "🛑 Too many requests from this IP, please try again later.",
  });
  app.use("/", limiter);

  // Enable response compression
  app.use(compression());
};
