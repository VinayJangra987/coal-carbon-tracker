import CarbonProject from "../models/CarbonProject.js";

export const getProjects = async (req, res) => {
  try {
    const filter = req.query.mine ? { mine: req.query.mine } : {};

    const projects = await CarbonProject.find(filter)
      .populate("mine", "name code state")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch carbon projects",
      error: err.message,
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await CarbonProject.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create carbon project",
      error: err.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await CarbonProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Carbon project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(400).json({
      message: "Failed to update carbon project",
      error: err.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await CarbonProject.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Carbon project not found" });
    }

    res.json({ message: "Carbon project deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete carbon project",
      error: err.message,
    });
  }
};
