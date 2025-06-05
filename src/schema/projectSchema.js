import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
        minlength: [50, "Project description must be at least 50 characters long"],
        trim: true, 
    },
    Images: {
        type: [String],
        default: [], 
    },
    repoLink: {
        type: String,
        required: [true, "Repository link is required"],
        validate: {
            validator: function(value) {
                return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(value);
            },
            message: "Invalid repository link format",
        },
    },
    contributors: {
        type: [String],
        required: [true, "At least one contributor is required"],
        validate: {
            validator: function(value) {
                return value.length > 0;
            },
            message: "At least one contributor is required",
        },
    },
    techStack: {
        type: [String],
        required: [true, "Tech stack is required"],
        validate: {
            validator: function(value) {
                return value.length > 0;
            },
            message: "At least one technology is required in the tech stack",
        },
    },
    liveLink: {
        type: String,
        default: "",
    },
    tags: {
        type: [String],
        required: [true, "At least one tag is required"],
        validate: {
            validator: function(value) {
                return value.length > 0;
            },
            message: "At least one tag is required",
        },
    }
}, {
    timestamps: true,
});

const Project = mongoose.model("Project", projectSchema);

export default Project;