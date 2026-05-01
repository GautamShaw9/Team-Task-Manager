import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createProject,
  getMyProjects,
  getMyTasks,
  getProjects,
  updateTaskStatus
} from "../api/api";
import TaskList from "../components/TaskList";
import { getCurrentUser, getToken } from "../utils/auth";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const navigate = useNavigate();
  const token = getToken();
  const user = getCurrentUser();
  const roleLabel = user?.role === "admin" ? "Admin" : "Member";

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          user?.role === "admin" ? await getProjects(token) : await getMyProjects(token);
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [navigate, token, user?.role]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadMyTasks = async () => {
      setTasksLoading(true);

      try {
        const data = await getMyTasks(token);
        setMyTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTasksLoading(false);
      }
    };

    loadMyTasks();
  }, [token]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Project name is required.");
      setSuccess("");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const project = await createProject({ name }, token);

      setProjects((current) => [...current, project]);
      setName("");
      setSuccess("Project created successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    setError("");
    setSuccess("");

    try {
      const updatedTask = await updateTaskStatus({ taskId, status }, token);
      setMyTasks((current) =>
        current.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      setSuccess(`Task moved to ${status}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingTaskId("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!token) {
    return null;
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="header-copy">
          <p className="eyebrow">Workspace</p>
          <h2>Dashboard</h2>
          <p className="welcome-copy">
            Welcome back, <span className="highlight-name">{user?.name || "there"}</span>
          </p>
          <p className="helper-text">
            Role: {roleLabel}. Here is your project overview.
          </p>
        </div>
        <div className="header-actions">
          <div className="user-chip">
            <span>{roleLabel}</span>
            <span>{projects.length} {projects.length === 1 ? "project" : "projects"}</span>
          </div>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Role</span>
          <strong>{roleLabel}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Projects</span>
          <strong>{projects.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">My Tasks</span>
          <strong>{myTasks.length}</strong>
        </div>
      </section>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h3>Create Project</h3>
            <p className="helper-text">Create a new project for your team workspace.</p>
          </div>
        </div>
        {user?.role === "admin" ? (
          <div className="form-inline">
            <input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handleCreate} disabled={submitting}>
              {submitting ? "Creating..." : "+ Create Project"}
            </button>
          </div>
        ) : (
          <p className="helper-text">Only admins can create projects.</p>
        )}
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h3>Your Projects</h3>
            <p className="helper-text">Open a project to view its tasks and progress.</p>
          </div>
        </div>

        {loading ? <p>Loading projects...</p> : null}

        {!loading && !projects.length ? (
          <div className="empty-state-card">
            <p className="empty-state">No projects assigned yet 🚀</p>
            <p className="helper-text">
              {user?.role === "admin"
                ? "Create your first project to get started."
                : "Projects with tasks assigned to you will appear here."}
            </p>
          </div>
        ) : null}

        {!loading && projects.length ? (
          <div className="project-list">
            {projects.map((project) => (
              <Link className="project-card" key={project._id} to={`/project/${project._id}`}>
                <div>
                  <strong>{project.name}</strong>
                  <p className="helper-text">Click to open</p>
                </div>
                <span className="project-open-text">View Project</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h3>My Tasks</h3>
            <p className="helper-text">Tasks currently assigned to you across the workspace.</p>
          </div>
        </div>

        {tasksLoading ? (
          <p>Loading your tasks...</p>
        ) : (
          <TaskList
            tasks={myTasks}
            currentUserId={user?.id}
            onStatusUpdate={handleStatusUpdate}
            updatingTaskId={updatingTaskId}
            emptyTitle="No tasks assigned yet 🚀"
            emptyDescription="When a task is assigned to you, it will appear here."
          />
        )}
      </div>
    </div>
  );
}
