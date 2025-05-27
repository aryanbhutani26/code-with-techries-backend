import Job from "../schema/jobSchema.js";

const createJob = async (jobData) => {
  return await Job.create(jobData);
};

const getJobById = async (jobId) => {
  const job = await Job.findById(jobId);
  return job;
};

const getAllJobs = async () => {
  return await Job.find({});
};

const getJobsByLocation = async (location) => {
  return await Job.find({ location: { $regex: new RegExp(location, "i") } });
};

const getJobsByType = async (jobType) => {
  return await Job.find({ jobType });
};

const deleteJobById = async (id) => {
  return await Job.findByIdAndDelete(id);
};

export {
  createJob,
  getJobById,
  getAllJobs,
  getJobsByLocation,
  getJobsByType,
  deleteJobById,
};
