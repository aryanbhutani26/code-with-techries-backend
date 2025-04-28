import mongoose, { Types } from "mongoose";

const classSchema = new mongoose.Schema(
  {
    teacherId: {
      type: Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
    },
    teacherRating: {
      type: Number,
      required: true,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating must be at most 5"],
      default: 0,
    },
    teacherSpecialization: {
      type: String,
      required: true,
      trim: true,
    },
    WhatsAppCommunityLink: {
      type: String,
      trim: true,
      default: "",
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    relatedTopics: {
      type: [String],
      default: [],
      required: true,
    },
    pendingChanges: {
      type: Object,
      default: null,
    },
    isPendingApproval: {
      type: Boolean,
      default: false,
    },
    originalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Original price must be greater than 0",
      },
    },
    discountedPrice: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.originalPrice;
        },
        message:
          "Discounted price must be less than or equal to original price",
      },
    },
    courseIncludes: {
      type: [String],
      default: [],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Course includes must have at least one item",
      },
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "What you will learn must have at least one item",
      },
    },
    thisCourseIncludes: {
      type: [String],
      default: [],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "This course includes must have at least one item",
      },
    },
    language: {
      type: String,
      enum: [
        "English",
        "Hindi",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Hinglish",
      ],
      required: true,
      default: "English",
    },
  },
  { timestamps: true }
);

const ClassModel = mongoose.model("Class", classSchema);

export default ClassModel;
