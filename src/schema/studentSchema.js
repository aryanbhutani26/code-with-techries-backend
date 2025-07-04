import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
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
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ], //regex  --> regular expression
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
    profilePicture: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
    degree: {
      type: String,
      default: "",
    },
    collegeName: {
      type: String,
      default: "",
    },
    currentCGPA: {
      type: Number,
      default: 0,
    },
    passoutYear: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    currentBacklogs: {
      type: Number,
      default: 0,
    },
    linkedIn: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    education: [
      {
        degree: { type: String, required: true },
        institute: { type: String, required: true },
        year: { type: String, required: true },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        url: { type: String, required: true },
        technologies: { type: [String], default: [] },
      },
    ],
    certifications: [
      {
        title: { type: String, default: "" },
        issuedBy: { type: String, default: "" },
        date: { type: Date, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Password Hashing Middleware
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//Method to compare password during login
studentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Student = mongoose.model("Student", studentSchema);

export default Student;
