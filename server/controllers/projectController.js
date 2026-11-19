import Project from '../models/Project.js';


// @desc    Upload a new room image
// @route   POST /api/projects/upload
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Create the project in MongoDB
    const project = await Project.create({
      user: req.user.id, // This comes from our auth middleware
      title: req.body.title || 'My Room',
      originalImage: `/uploads/${req.file.filename}` // Save the path to the image
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};
// @desc    Get user projects
// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    // Find projects where the 'user' field matches the logged-in user's ID
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};// @desc    Get project by ID
// @route   GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Save painted project image
// @route   PUT /api/projects/:id
export const saveProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user owns this project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update the project with the new painted image
    project.paintedImage = req.body.paintedImage;
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};
// @desc    Get all projects (Admin only)
// @route   GET /api/projects/admin/all
export const getAllProjects = async (req, res, next) => {
  try {
    // Fetch all projects and get the user's name/email who created them
    const projects = await Project.find().populate('user', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};