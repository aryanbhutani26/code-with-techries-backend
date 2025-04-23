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
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    currentCGPA: {
      type: Number,
      required: true,
    },
    passoutYear: {
      type: Number,
      required: true,
    },
    skills: {
      type: [String],
      default: "",
    },
    currentBacklogs: {
      type: Number,
      default: 0,
    },
    certification: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      required: true,
    },
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
studentSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Student = mongoose.model("Student", studentSchema);

export default Student;
