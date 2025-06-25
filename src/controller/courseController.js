import {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourseById,
  getCourseByTitle,
  getCoursesByInstructor,
} from "../service/courseService.js";

const createCourseController = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: err.message,
    });
  }
};

const getCourseByIdController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: err.message,
    });
  }
};

const getCourseByTitleController = async (req, res) => {
  try {
    const { title } = req.params;
    const course = await getCourseByTitle(title);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: err.message,
    });
  }
};

const getCoursesByInstructorController = async (req, res) => {
  try {
    const { instructorName } = req.params;
    const courses = await getCoursesByInstructor(instructorName);
    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: err.message,
    });
  }
};

const deleteCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deletedCourse = await deleteCourse(courseId);
    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: err.message,
    });
  }
};

const updateCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updatedCourse = await updateCourse(courseId, req.body);
    console.log("Updated Course:", updatedCourse);
    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: err.message,
    });
  }
};

export {
  createCourseController,
  getCourseByIdController,
  getCourseByTitleController,
  getCoursesByInstructorController,
  deleteCourseController,
  updateCourseController,
};
