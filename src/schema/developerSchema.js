import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { text } from "express";

const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [1024, "Password cannot be more than 1024 characters"],
      select: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    fieldOfInterest: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        description: { type: String, required: true },
      }
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        url: { type: String, required: true },
        technologies: { type: [String], required: true },
      }
    ],
    portfolioWebsite: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

developerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

developerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Developer = mongoose.model("Developer", developerSchema);

export default Developer;
