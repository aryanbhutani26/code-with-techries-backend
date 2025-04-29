import mongoose from "mongoose";
import bcrypt from "bcrypt";  

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Admin",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    default: "",
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
}, {
    timestamps: true,
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model("Admin", adminSchema);


export default Admin;