import mongoose from "mongoose";
import Project from "./projectSchema.js";

const contributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      required: true,
      enum: ["Student", "Developer"],
    },
    prLink: {
      type: String,
      required: true,
    },
    prNumber: {
      type: Number,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    projectName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["merged", "open", "closed", "rejected"],
      default: "open",
    },
  },
  { timestamps: true }
);

contributionSchema.pre("save", async function (next) {
  if (this.isModified("projectId") || !this.projectName) {
    const project = await Project.findById(this.projectId);
    if (project) {
      this.projectName = project.title;
    }
  }
  next();
});

const Contribution = mongoose.model("Contribution", contributionSchema);

export default Contribution;
