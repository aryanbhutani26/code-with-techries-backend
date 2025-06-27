import {
  createFeedback,
  deleteFeedback,
  updateFeedback,
  getAllFeedbackByCourseId,
} from "../service/feedbackService.js";

const createFeedbackController = async (req, res) => {
  try {
    const { studentId, courseId, rating, comment } = req.body;
    const feedback = await createFeedback({
      studentId,
      courseId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      feedback,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: err.message,
    });
  }
};

const deleteFeedbackController = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const deleted = await deleteFeedback(feedbackId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: err.message,
    });
  }
};

const updateFeedbackController = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const updated = await updateFeedback(feedbackId, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
      error: err.message,
    });
  }
};

const getAllFeedbackByCourseIdController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const feedbacks = await getAllFeedbackByCourseId(courseId);

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: err.message,
    });
  }
};

export {
  createFeedbackController,
  deleteFeedbackController,
  updateFeedbackController,
  getAllFeedbackByCourseIdController,
};
