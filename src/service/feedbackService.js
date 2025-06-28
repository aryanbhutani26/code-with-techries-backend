import Feedback from "../schema/feedbackSchema.js";
import Student from "../schema/studentSchema.js";
import Course from "../schema/courseSchema.js";

const createFeedback = async ({ studentId, courseId, rating, comment }) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const course = await Course.findOne({ courseId });
  if (!course) throw new Error("Course not found");

  const existingFeedback = await Feedback.findOne({ studentId, courseId });
  if (existingFeedback) {
    throw new Error("You have already submitted feedback for this course.");
  }

  const feedback = new Feedback({
    studentId,
    studentName: student.name,
    courseId,
    rating,
    comment,
  });

  const savedFeedback = await feedback.save();

  await updateCourseRatingStats(courseId);

  return savedFeedback;
};

const updateCourseRatingStats = async (courseId) => {
  const feedbacks = await Feedback.find({ courseId });

  const totalComments = feedbacks.length;
  const avgRating =
    totalComments > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalComments
      : 0;

  await Course.findOneAndUpdate(
    { courseId },
    {
      $set: {
        rating: parseFloat(avgRating.toFixed(2)),
        totalComments: feedbacks.length,
      },
    }
  );
};

const deleteFeedback = async (feedbackId) => {
  const feedback = await Feedback.findByIdAndDelete(feedbackId);
  if (feedback) {
    await updateCourseRatingStats(feedback.courseId);
  }
  return feedback;
};

const updateFeedback = async (feedbackId, updatedData) => {
  const oldFeedback = await Feedback.findById(feedbackId);
  const updated = await Feedback.findByIdAndUpdate(feedbackId, { $set: updatedData }, { new: true });

  if (updated && updatedData.rating && oldFeedback.rating !== updatedData.rating) {
    await updateCourseRatingStats(updated.courseId);
  }

  return updated;
};

const getAllFeedbackByCourseId = async (courseId) => {
  return await Feedback.find({ courseId }).sort({ createdAt: -1 });
};



export {
  createFeedback,
  deleteFeedback,
  updateFeedback,
  getAllFeedbackByCourseId,
  updateCourseRatingStats,
};
