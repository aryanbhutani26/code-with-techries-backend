import {
  createJob,
  getAllJobs,
  getJobsByLocation,
  getJobsByType,
  deleteJobById,
} from "../service/jobService.js";

const createJobController = async (req, res) => {
  try {
    const newJob = await createJob(req.body);
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Job creation failed",
      error: err.message,
    });
  }
};

const getAllJobsController = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: err.message,
    });
  }
};

const getJobsByLocationController = async (req, res) => {
  try {
    const { location } = req.params;
    const jobs = await getJobsByLocation(location);
    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: err.message,
    });
  }
};

const getJobsByTypeController = async (req, res) => {
  try {
    const { jobType } = req.params;
    const jobs = await getJobsByType(jobType);
    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: err.message,
    });
  }
};

const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await deleteJobById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: err.message,
    });
  }
};

export {
  createJobController,
  getAllJobsController,
  getJobsByLocationController,
  getJobsByTypeController,
  deleteJobController,
};
