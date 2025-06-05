import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByTechStack,
  updateProject,
} from "../service/projectService.js";
import Project from "../schema/projectSchema.js";
import { sendDeveloperNotification } from "../utils/ProjectEmail.js";

const createProjectController = async (req, res) => {
  try {
    const projectData = req.body;
    const newProject = await createProject(projectData);

    if (req.user?.role === 'developer') {
      try {
        await sendDeveloperNotification({
          developerEmail: req.user.email,
          developerName: req.user.name,
          action: 'created',
          project: newProject,
        });
      } catch (emailError) {
        console.error('Notification email failed:', emailError);
        // Optionally, continue silently or send a warning in response
      }
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message,
    });
  }
};

const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await deleteProject(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (req.user?.role === 'developer') {
      try {
        await sendDeveloperNotification({
          developerEmail: req.user.email,
          developerName: req.user.name,
          action: 'deleted',
          project: deletedProject,
        });
      } catch (emailError) {
        console.error('Notification email failed:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      deletedProject: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message,
    });
  }
};

const getAllProjectsController = async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

const getProjectsByTechStackController = async (req, res) => {
  try {
    const { tech } = req.params;

    const projects = await getProjectsByTechStack(tech);

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No projects found with tech stack: ${tech}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Projects using ${tech} fetched successfully`,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects by tech stack",
      error: error.message,
    });
  }
};

const getProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProject = await updateProject(id, updateData);

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or update failed',
      });
    }

    if (req.user?.role === 'developer') {
      try {
        await sendDeveloperNotification({
          developerEmail: req.user.email,
          developerName: req.user.name,
          action: 'updated',
          project: updatedProject,
        });
      } catch (emailError) {
        console.error('Notification email failed:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message,
    });
  }
};

const uploadProjectImagesController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    // Extract Cloudinary URLs
    const imageUrls = files.map((file) => file.path);

    // Update the project by pushing new image URLs
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { Images: { $each: imageUrls } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded and added to project successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

export {
  createProjectController,
  deleteProjectController,
  getAllProjectsController,
  getProjectsByTechStackController,
  getProjectByIdController,
  updateProjectController,
  uploadProjectImagesController,
};
