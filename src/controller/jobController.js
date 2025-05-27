import {
  createJob,
  getAllJobs,
  getJobsByLocation,
  getJobsByType,
  deleteJobById,
  getJobById,
} from "../service/jobService.js";
import { sendRecruiterNotification } from "../utils/JobEmail.js";

const createJobController = async (req, res) => {
  try {
    const newJob = await createJob(req.body);

    // If user is a recruiter, send email
    if (req.user.role === "recruiter") {
      await sendRecruiterNotification({
        recruiterEmail: req.user.email,
        recruiterName: req.user.name,
        action: "created",
        job: newJob,
      });
    }

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
    const job = await getJobById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const deletedJob = await deleteJobById(id);

    // Send email only if recruiter
    if (req.user.role === "recruiter") {
      await sendRecruiterNotification({
        recruiterEmail: req.user.email,
        recruiterName: req.user.name,
        action: "deleted",
        job,
      });
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
