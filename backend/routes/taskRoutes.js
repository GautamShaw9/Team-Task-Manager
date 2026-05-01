const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// Create task
router.post("/create", auth, async (req, res) => {
  const task = await Task.create(req.body);
  const populatedTask = await Task.findById(task._id).populate("assignedTo", "name role");
  res.json(populatedTask);
});

// Get tasks
router.get("/project/:id", auth, async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.id }).populate("assignedTo", "name role");
  res.json(tasks);
});

// Get logged-in user's tasks
router.get("/mytasks", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id }).populate("assignedTo", "name role");
  res.json(tasks);
});

// Update status
router.put("/status", auth, async (req, res) => {
  const { taskId, status } = req.body;

  const task = await Task.findById(taskId);

  if (task.assignedTo.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  task.status = status;
  await task.save();

  const populatedTask = await Task.findById(task._id).populate("assignedTo", "name role");
  res.json(populatedTask);
});

module.exports = router;
