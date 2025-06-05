import Project from "../schema/projectSchema.js";

const createProject = async (projectData) => {
  const project = new Project(projectData);
  return await project.save(); 
};

const updateProject = async (projectId, updateData) => {
  return await Project.findByIdAndUpdate(projectId, updateData, { new: true });
};

const deleteProject = async (projectId) => {
  return await Project.findByIdAndDelete(projectId);
};

const getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 }); 
};

const getProjectById = async (projectId) => {
  return await Project.findById(projectId);
};

const getProjectsByTechStack = async (techStack) => {
  return await Project.find({ techStack: { $in: [techStack] } });
};

export {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByTechStack,
};
