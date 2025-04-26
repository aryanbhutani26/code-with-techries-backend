// const careerService = require("../service/careerService");
import careerService from "../service/careerService.js";
const createCareer = async (req, res) => {
  try {
    const career = await careerService.createCareer(req.body);
    res.status(201).json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCareers = async (req, res) => {
  try {
    const careers = await careerService.getAllCareers();
    res.status(200).json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCareerById = async (req, res) => {
  try {
    const career = await careerService.getCareerById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.status(200).json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCareerById = async (req, res) => {
  try {
    const updatedCareer = await careerService.updateCareerById(req.params.id, req.body);
    if (!updatedCareer) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.status(200).json(updatedCareer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCareerById = async (req, res) => {
  try {
    await careerService.deleteCareerById(req.params.id);
    res.status(200).json({ message: "Career deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createCareer,
  getAllCareers,
  getCareerById,
  updateCareerById,
  deleteCareerById,
};
