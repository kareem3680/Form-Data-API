import { Schema, model } from "mongoose";

const courseApplicationSchema = new Schema(
  {
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: [true, "Level is required"],
    },
    hasExperience: {
      type: Boolean,
      default: false,
    },
    goal: {
      type: String,
      required: [true, "Goal is required"],
      trim: true,
    },
    source: {
      type: String,
      enum: ["Instagram", "Facebook", "LinkedIn", "Friend", "Other"],
      required: [true, "Source is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const courseApplicationModel = model(
  "courseApplication",
  courseApplicationSchema,
);
export default courseApplicationModel;
