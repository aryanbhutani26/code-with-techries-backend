import Student from "../schema/studentSchema.js";
import Teacher from "../schema/teacherSchema.js";
import Developer from "../schema/developerSchema.js";
import Recruiter from "../schema/recruiterSchema.js";
import Career from "../schema/careerSchema.js";
import ClassModel from "../schema/classSchema.js";
import JobModel from "../schema/jobSchema.js";

const globalSearch = async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase();
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const results = [];

    const models = [
      {
        model: Student,
        role: "Student",
        exclude: [
          "password",
          "email",
          "phoneNumber",
          "profilePicture",
          "imageUrl",
          "age",
          "degree",
          "collegeName",
          "currentCGPA",
          "passoutYear",
          "skills",
          "currentBacklogs",
          "certification",
          "linkedIn",
          "createdAt",
          "updatedAt",
          "_id",
          "__v",
        ],
      },
      {
        model: Teacher,
        role: "Teacher",
        exclude: [
          "email",
          "password",
          "phoneNumber",
          "profilePicture",
          "imageUrl",
          "experience",
          "subject",
          "linkedin",
          "github",
          "createdAt",
          "updatedAt",
          "_id",
          "__v",
        ],
      },
      {
        model: Developer,
        role: "Developer",
        exclude: [
          "email",
          "password",
          "phoneNumber",
          "profilePicture",
          "imageUrl",
          "fieldOfInterest",
          "skills",
          "experience",
          "linkedin",
          "github",
          "_id",
          "__v",
        ],
      },
      {
        model: Recruiter,
        role: "Recruiter",
        exclude: [
          "email",
          "password",
          "phoneNumber",
          "profilePicture",
          "imageUrl",
          "companyName",
          "companyDescription",
          "jobTitle",
          "jobDescription",
          "linkedin",
          "createdAt",
          "updatedAt",
          "_id",
          "__v",
        ],
      },
      {
        model: Career,
        role: "Career",
        exclude: ["createdAt", "updatedAt", "_id", "__v"],
      },
      {
        model: ClassModel,
        role: "Classes",
        exclude: [
          "teacherId",
          "pendingChanges",
          "isPendingApproval",
          "createdAt",
          "updatedAt",
          "_id",
          "__v",
        ],
      },
      {
        model: JobModel,
        role: "Job",
        exclude: [
          "jobType",
          "recruitmentQuota",
          "recruitmentPeriod",
          "salaryPerMonth",
          "experienceInYears",
          "location",
          "skills",
          "jobDescription",
          "createdAt",
          "updatedAt",
          "_id",
          "__v",
          "keywords",
        ],
      },
    ];

    for (const { model, role, exclude } of models) {
      const documents = await model.find();

      documents.forEach((doc) => {
        const docObject = doc.toObject();
        const entries = Object.entries(docObject);

        entries.forEach(([key, value]) => {
          // Skip if field is in exclude list or not a string
          if (exclude.includes(key) || typeof value !== "string") {
            return;
          }

          if (value.toLowerCase().includes(query)) {
            results.push({
              role,
              field: key,
              value,
              id: doc._id,
            });
          }
        });
      });
    }

    res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: err.message,
    });
  }
};

const jobSearch = async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase();
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const results = [];

    // Fields to exclude completely from search
    const excludeFields = [
      "createdAt",
      "updatedAt",
      "_id",
      "__v",
      "recruitmentQuota",
      "recruitmentPeriod",
      "salaryPerMonth",
      "jobDescription",
      "skills",
    ];

    // Get all job documents
    const jobs = await JobModel.find();

    jobs.forEach((job) => {
      const jobObject = job.toObject();
      const entries = Object.entries(jobObject);

      entries.forEach(([key, value]) => {
        // Skip excluded fields
        if (excludeFields.includes(key)) {
          return;
        }

        // Handle number fields (like experienceInYears)
        if (typeof value === "number") {
          if (value.toString().includes(query)) {
            results.push({
              field: key,
              value: value,
              id: job._id,
            });
          }
        }
        // Handle string fields
        else if (typeof value === "string") {
          if (value.toLowerCase().includes(query)) {
            results.push({
              field: key,
              value,
              id: job._id,
            });
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Job search failed",
      error: err.message,
    });
  }
};

export { globalSearch, jobSearch };
