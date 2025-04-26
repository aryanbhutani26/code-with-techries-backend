// const mongoose = require("mongoose");
import mongoose from "mongoose";


const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-time", "Internship", "Contract", "Remote"],
    required: [true, "Job type is required"],
  },
  skillsRequired: {
    type: [String],
    required: [true, "Skills are required"],
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "At least one skill must be specified",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Career = mongoose.model("Career", careerSchema);

export default Career;
