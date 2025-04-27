import {
  createCareer,
  getAllCareers,
  getCareerById,
  updateCareerById,
  deleteCareerById,
} from "../service/careerService.js";

const createCareerController = async (req, res) => {
  try {
    const career = await createCareer(req.body);
    res.status(201).json({
      success: true,
      message: "Career created successfully",
      career,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Career creation failed",
      error: error.message,
    });
  }
};

const getAllCareerController = async (req, res) => {
  try {
    const careers = await getAllCareers();
    res.status(200).json({
      success: true,
      message: "Careers retrieved successfully",
      careers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve careers",
      error: error.message,
    });
  }
};

const getCareerByIdController = async (req, res) => {
  try {
    const career = await getCareerById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.status(200).json({
      success: true,
      message: "Career retrieved successfully",
      career,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve career",
      error: error.message,
    });
  }
};

const updateCareerByIdController = async (req, res) => {
  try {
    const updatedCareer = await updateCareerById(req.params.id, req.body);
    if (!updatedCareer) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.status(200).json({
      success: true,
      message: "Career updated successfully",
      career: updatedCareer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Career update failed",
      error: error.message,
    });
  }
};

const deleteCareerByIdController = async (req, res) => {
  try {
    await deleteCareerById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Career deletion failed",
      error: error.message,
    });
  }
};

export {
  createCareerController,
  getAllCareerController,
  getCareerByIdController,
  updateCareerByIdController,
  deleteCareerByIdController,
};
