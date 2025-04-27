import {
  createClass,
  updateClass,
  deleteClass,
} from "../service/classService.js";
import { sendClassCreationEmail } from "../utils/mailer.js";
import ClassModel from "../schema/classSchema.js";

const createNewClass = async (req, res) => {
  try {
    const teacherEmail = req.user.email; 
    
    const {
      className,
      shortDescription,
      teacherName,
      teacherRating,
      teacherSpecialization,
      googleMeetLink,
      longDescription,
      relatedTopics,
      originalPrice,
      discountedPrice,
      courseIncludes,
      whatYouWillLearn,
      thisCourseIncludes,
      language,
    } = req.body;

    const newClass = await createClass({
      className,
      shortDescription,
      teacherName,
      teacherRating,
      teacherSpecialization,
      googleMeetLink,
      longDescription,
      relatedTopics,
      originalPrice,
      discountedPrice,
      courseIncludes,
      whatYouWillLearn,
      thisCourseIncludes,
      language,
    });

    await sendClassCreationEmail(teacherEmail, newClass);

    res.status(201).json({
      success: true,
      message: "Class created and email sent!",
      newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find(); // fetch all classes
    res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      classes,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch classes",
        error: error.message,
      });
  }
};

const updateExistingClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const updatedClass = await updateClass(classId, req.body);

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    });
  }
};

const deleteExistingClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const deletedClass = await deleteClass(classId);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    });
  }
};

export { createNewClass, getAllClasses, updateExistingClass, deleteExistingClass };
