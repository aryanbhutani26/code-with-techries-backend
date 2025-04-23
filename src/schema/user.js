import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: { type: String, required: true, unique: true },
    photo: String,
    password: String, // for manual login
    role: {
        type: String,
        enum: ['student', 'recruiter', 'developer'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
