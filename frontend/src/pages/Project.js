import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createTask, getMembers, getTasksByProject, updateTaskStatus } from "../api/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { getCurrentUser, getToken } from "../utils/auth";

export default function Project() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const user = getCurrentUser();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const roleLabel = user?.role === "admin" ? "Admin" : "Member";

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadTasks = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const data = await getTasksByProject(projectId, token);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [navigate, projectId, token]);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      return;
    }

    const loadMembers = async () => {
      setMembersLoading(true);

      try {
        const data = await getMembers(token);
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setMembersLoading(false);
      }
    };

    loadMembers();
  }, [token, user?.role]);

  const handleCreateTask = async (formData) => {
    setCreateLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || undefined
      };
      const newTask = await createTask(payload, token);
      setTasks((current) => [...current, newTask]);
      setSuccess("Task created successfully.");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    setError("");
    setSuccess("");

    try {
      const updatedTask = await updateTaskStatus({ taskId, status }, token);

      setTasks((current) =>
        current.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      setSuccess(`Task moved to ${status}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingTaskId("");
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="header-copy">
          <Link to="/dashboard">Back to Dashboard</Link>
          <p className="eyebrow">Project Workspace</p>
          <h2>Project Tasks</h2>
          <p className="helper-text">Track progress, due dates, and ownership in one place.</p>
        </div>
        <div className="user-chip">
          <span>{roleLabel}</span>
          <span>{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      {user?.role === "admin" ? (
        <TaskForm
          projectId={projectId}
          members={members}
          membersLoading={membersLoading}
          onSubmit={handleCreateTask}
          isSubmitting={createLoading}
        />
      ) : (
        <div className="panel">
          <h3>Task Creation</h3>
          <p className="helper-text">Only admins can create tasks.</p>
        </div>
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h3>Task List</h3>
            <p className="helper-text">Assigned users can move tasks from Todo to InProgress to Done.</p>
          </div>
        </div>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            currentUserId={user?.id}
            onStatusUpdate={handleStatusUpdate}
            updatingTaskId={updatingTaskId}
          />
        )}
      </section>
    </div>
  );
}
