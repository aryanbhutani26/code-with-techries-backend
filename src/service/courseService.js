import Course from "../schema/courseSchema.js";

const createCourse = async (courseData) => {
  const newCourse = new Course(courseData);
  return await newCourse.save();
};

const getCourseById = async (courseId) => {
  return await Course.findOne({ courseId });
};

const getCourseByTitle = async (title) => {
  return await Course.findOne({ title });
};

const getCoursesByInstructor = async (instructorName) => {
  return await Course.find({ "instructor.name": instructorName });
};

const deleteCourse = async (courseId) => {
  return await Course.findOneAndDelete({ courseId });
};

const updateCourse = async (courseId, updatedData) => {
  return await Course.findOneAndUpdate(
    { courseId },
    { $set: updatedData },
    { new: true }
  );
};

export {
  createCourse,
  getCourseById,
  getCourseByTitle,
  getCoursesByInstructor,
  deleteCourse,
  updateCourse,
};
