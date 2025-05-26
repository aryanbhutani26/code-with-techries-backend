import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],  
        trim: true,
    },
    jobType: {
        type: String,
        required: [true, "Job type is required"],
        enum: ["Full-time", "Part-time", "Remote", "Hybrid", "On-site"],
    },
    recruitmentQuota: {
        type: Number,
        required: [true, "Recruitment quota is required"],
        min: [1, "Recruitment quota must be at least 1"],
    },
    recruitmentPeriod: {
        type: Date,
        required: [true, "Recruitment period is required"],
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: "Recruitment period must be in the future",
        },
    },
    salaryPerMonth: {
        type: Number,
        required: [true, "Salary per month is required"],
        min: [0, "Salary per month must be a positive number"],
    },
    experienceInYears: {
        type: Number,
        required: [true, "Experience in years is required"],
        min: [0, "Experience in years cannot be negative"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
    },
    skills: {
        type: [String],
        required: [true, "Skills are required"],
        validate: {
            validator: function(value) {
                return value.length > 0;
            },
            message: "At least one skill is required",
        },
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
        minlength: [50, "Job description must be at least 50 words long"],
        trim: true,
    },
    keywords: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
