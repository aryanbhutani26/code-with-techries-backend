// const Career = require("../schema/careerModel");
import Career from "../schema/careerModel.js";
// Create a new job
const createCareer = async (careerData) => {
  const career = new Career(careerData);
  await career.save();
  return career;
};

// Get all jobs
const getAllCareers = async () => {
  const careers = await Career.find();
  return careers;
};

// Get a single job by ID
const getCareerById = async (id) => {
  const career = await Career.findById(id);
  return career;
};

// Update a job by ID
const updateCareerById = async (id, updateData) => {
  const updatedCareer = await Career.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedCareer;
};

// Delete a job by ID
const deleteCareerById = async (id) => {
  await Career.findByIdAndDelete(id);
};

export default{
  createCareer,
  getAllCareers,
  getCareerById,
  updateCareerById,
  deleteCareerById,
};
