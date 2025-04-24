import Developer from "../schema/developerSchema.js";

const createDeveloper = async (data) => {
  return await Developer.create(data);
};

const findDeveloperByEmail = async (email) => {
  return await Developer.findOne({ email });
};

const findDeveloperById = async (id) => {
  return await Developer.findById(id).select("-password");
};

const updateDeveloperById = async (id, data) => {
  return await Developer.findByIdAndUpdate(id, data, { new: true });
};

const deleteDeveloperById = async (id) => {
  return await Developer.findByIdAndDelete(id);
};

export { createDeveloper, findDeveloperByEmail, updateDeveloperById, deleteDeveloperById, findDeveloperById };
