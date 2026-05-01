const router = require("express").Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// Create project
router.post("/create", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin allowed" });
  }

  const project = await Project.create({
    name: req.body.name,
    createdBy: req.user.id,
    members: [req.user.id]
  });

  res.json(project);
});

// Add member
router.post("/add-member", auth, async (req, res) => {
  const { projectId, userId } = req.body;

  const project = await Project.findById(projectId);
  project.members.push(userId);
  await project.save();

  res.json(project);
});

// Get projects
router.get("/all", auth, async (req, res) => {
  const projects = await Project.find({
    members: req.user.id
  });

  res.json(projects);
});

// Get logged-in member's assigned projects
router.get("/myprojects", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id }).select("projectId");
  const projectIds = [...new Set(tasks.map((task) => task.projectId.toString()))];
  const projects = await Project.find({ _id: { $in: projectIds } });

  res.json(projects);
});

module.exports = router;
