const API_BASE = "/api/tasks";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let allTasks = [];

// ---------- API calls ----------

async function fetchTasks() {
  const res = await fetch(API_BASE);
  allTasks = await res.json();
  render();
}

async function createTask(task) {
  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  await fetchTasks();
}

async function updateTask(id, updates) {
  await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  await fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  await fetchTasks();
}

// ---------- Rendering ----------

function render() {
  let visible = allTasks;
  if (currentFilter === "active") visible = allTasks.filter((t) => !t.completed);
  if (currentFilter === "completed") visible = allTasks.filter((t) => t.completed);

  taskList.innerHTML = "";

  if (visible.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  visible
    .slice()
    .reverse()
    .forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
        <div class="task-content">
          <div class="task-title">${escapeHtml(task.title)}</div>
          ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ""}
          <div class="task-meta">
            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
          </div>
        </div>
        <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">✕</button>
      `;
      taskList.appendChild(li);
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Event listeners ----------

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  await createTask({
    title,
    description: descInput.value.trim(),
    priority: priorityInput.value,
  });

  form.reset();
  priorityInput.value = "medium";
  titleInput.focus();
});

taskList.addEventListener("change", (e) => {
  if (e.target.classList.contains("task-checkbox")) {
    const id = Number(e.target.dataset.id);
    updateTask(id, { completed: e.target.checked });
  }
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    deleteTask(id);
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ---------- Init ----------

fetchTasks();
