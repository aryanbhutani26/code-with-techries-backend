import Recruiter from "../schema/recruiterSchema.js";

const createRecruiter = async (data) => {
  const newRecruiter = new Recruiter(data);
  return await newRecruiter.save();
};

const findRecruiterByEmail = async (email) => {
  return await Recruiter.findOne({ email });
};

const updateRecruiter = async (id, update) => {
  return await Recruiter.findByIdAndUpdate(id, update, { new: true });
};

export { createRecruiter, findRecruiterByEmail, updateRecruiter };
