import Student from "../schema/studentSchema.js";
import Teacher from "../schema/teacherSchema.js";
import Developer from "../schema/developerSchema.js";
import Recruiter from "../schema/recruiterSchema.js";
import Career from "../schema/careerSchema.js";
import ClassModel from "../schema/classSchema.js";

const globalSearch = async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase();
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const results = [];

    const models = [
      { model: Student, role: "Student" },
      { model: Teacher, role: "Teacher" },
      { model: Developer, role: "Developer" },
      { model: Recruiter, role: "Recruiter" },
      { model: Career, role: "Career" },
      { model: ClassModel, role: "Classes" }
    ];

    for (const { model, role } of models) {
      const documents = await model.find();

      documents.forEach(doc => {
        const entries = Object.entries(doc.toObject());
        entries.forEach(([key, value]) => {
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(query)
          ) {
            results.push({
              role,
              field: key,
              value,
              id: doc._id
            });
          }
        });
      });
    }

    res.status(200).json({
      success: true,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search failed", error: err.message });
  }
};


export default globalSearch;