import Feedback from "../schema/feedbackSchema.js";
import Student from "../schema/studentSchema.js";
import Course from "../schema/courseSchema.js";

const createFeedback = async ({ studentId, courseId, rating, comment }) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const course = await Course.findOne({ courseId });
  if (!course) throw new Error("Course not found");

  const feedback = new Feedback({
    studentId,
    studentName: student.name,
    courseId,
    rating,
    comment,
  });

  return await feedback.save();
};

const deleteFeedback = async (feedbackId) => {
  return await Feedback.findByIdAndDelete(feedbackId);
};

const updateFeedback = async (feedbackId, updatedData) => {
  return await Feedback.findByIdAndUpdate(
    feedbackId,
    { $set: updatedData },
    { new: true }
  );
};

const getAllFeedbackByCourseId = async (courseId) => {
  return await Feedback.find({ courseId }).sort({ createdAt: -1 });
};

export {
  createFeedback,
  deleteFeedback,
  updateFeedback,
  getAllFeedbackByCourseId,
};
