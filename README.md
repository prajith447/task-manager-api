# Task Manager API

A REST API for managing tasks, built with **Node.js** and **Express**, with a simple
frontend client that consumes it via `fetch`. Data is stored in a local JSON file
(`db.json`), so there's no external database to configure — it runs immediately.

## Features

- Full CRUD: create, read, update, and delete tasks
- Filter tasks by completion status (`?completed=true`)
- Input validation with proper HTTP status codes (400, 404, 201)
- Priority levels (low / medium / high)
- A working frontend (HTML/CSS/JS) that calls the API live — not just a Postman demo

## API Endpoints

| Method | Endpoint          | Description                  |
|--------|-------------------|-------------------------------|
| GET    | `/api/tasks`      | List all tasks (optional `?completed=true/false`) |
| GET    | `/api/tasks/:id`  | Get a single task            |
| POST   | `/api/tasks`      | Create a new task             |
| PUT    | `/api/tasks/:id`  | Update an existing task       |
| DELETE | `/api/tasks/:id`  | Delete a task                 |
| GET    | `/api/health`     | Health check                  |

**Example request body for POST/PUT:**
```json
{
  "title": "Finish resume",
  "description": "Add the new project",
  "priority": "high"
}
```

## Run it on Replit (no laptop needed)

1. Go to [replit.com](https://replit.com) and sign in (use your GitHub account to link them).
2. Tap **"Create Repl"** → **"Import from GitHub"**.
3. First, create a GitHub repo for this project (same way you did for your portfolio):
   - Create a new repo, e.g. `task-manager-api`
   - Upload all these files (`server.js`, `package.json`, `db.json`, `README.md`, and the `public` folder with its 3 files) keeping the same folder structure
4. Back in Replit, paste your GitHub repo URL to import it.
5. Replit will detect it's a Node.js project. Tap **"Run"** — it will run `npm install` automatically and start the server.
6. Replit gives you a live URL (shown in the webview pane) — that's your working, hosted API + frontend.
7. Copy that live URL — this is what you'll link on your resume and GitHub README as the live demo.

## Run it locally (if you ever get access to a laptop)

```bash
npm install
npm start
```
Then open `http://localhost:3000` in a browser.

## Tech stack

Node.js, Express, vanilla JavaScript (frontend), JSON file storage.
