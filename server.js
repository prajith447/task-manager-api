/**
 * Task Manager API
 * A simple REST API for managing tasks — built with Node.js and Express.
 * Data is persisted to a local JSON file (db.json), so no external
 * database setup is required to run this project.
 *
 * Endpoints:
 *   GET    /api/tasks        -> list all tasks
 *   GET    /api/tasks/:id    -> get a single task
 *   POST   /api/tasks        -> create a new task
 *   PUT    /api/tasks/:id    -> update an existing task
 *   DELETE /api/tasks/:id    -> delete a task
 */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- Helpers: read/write the JSON "database" ----------

function readTasks() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tasks: [], nextId: 1 }, null, 2));
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTasks(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ---------- Routes ----------

// GET all tasks (supports optional ?completed=true/false filter)
app.get("/api/tasks", (req, res) => {
  const data = readTasks();
  let tasks = data.tasks;

  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === "true";
    tasks = tasks.filter((t) => t.completed === isCompleted);
  }

  res.json(tasks);
});

// GET a single task by id
app.get("/api/tasks/:id", (req, res) => {
  const data = readTasks();
  const task = data.tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

// POST a new task
app.post("/api/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Field 'title' is required" });
  }

  const data = readTasks();
  const newTask = {
    id: data.nextId,
    title: title.trim(),
    description: description ? String(description).trim() : "",
    priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  data.nextId += 1;
  writeTasks(data);

  res.status(201).json(newTask);
});

// PUT (update) an existing task
app.put("/api/tasks/:id", (req, res) => {
  const data = readTasks();
  const task = data.tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, description, priority, completed } = req.body;

  if (title !== undefined) task.title = String(title).trim();
  if (description !== undefined) task.description = String(description).trim();
  if (priority !== undefined && ["low", "medium", "high"].includes(priority)) {
    task.priority = priority;
  }
  if (completed !== undefined) task.completed = Boolean(completed);

  writeTasks(data);
  res.json(task);
});

// DELETE a task
app.delete("/api/tasks/:id", (req, res) => {
  const data = readTasks();
  const index = data.tasks.findIndex((t) => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const [deleted] = data.tasks.splice(index, 1);
  writeTasks(data);
  res.json({ message: "Task deleted", task: deleted });
});

// Health check endpoint (useful for uptime checks / demos)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Task Manager API running on port ${PORT}`);
});
