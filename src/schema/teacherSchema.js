import mongoose from "mongoose";
import bcrypt from "bcrypt";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
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
    profilePicture: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
    },
    subject: {
      type: [String],
      default: [],
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password for login
teacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
