const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// CREATE TASK (Admin only)
router.post("/create", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      deadline
    });

    await task.save();

    res.json("Task created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Error creating task");
  }
});


// GET ALL TASKS (Admin only)
router.get("/all", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json("Error fetching tasks");
  }
});

// GET MY TASKS (Employee only)
router.get("/my", authMiddleware, roleMiddleware("employee"), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json("Error fetching tasks");
  }
});

// UPDATE TASK STATUS (Employee only)
router.put("/update/:id", authMiddleware, roleMiddleware("employee"), async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json("Task not found");
    }

    // Ensure employee updates only their own task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json("Not authorized");
    }

    task.status = status;
    await task.save();

    res.json("Task updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Error updating task");
  }
});
module.exports = router;