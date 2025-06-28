import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
      minlength: 20,
      trim: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    instructor: {
      name: {
        type: String,
        default: "",
      },
      title: {
        type: String,
        default: "",
      },
      rating: {
        type: Number,
        default: 0,
      },
      students: {
        type: String,
        default: "",
      },
      courses: {
        type: String,
        default: "",
      },
    },
    level: {
      type: String,
      default: "beginner",
      enum: ["beginner", "intermediate", "advanced"],
    },
    type: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    language: {
      type: String,
      default: "English",
    },
    learningPoints: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    totalComments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
