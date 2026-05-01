const getNextStatus = (status) => {
  if (status === "Todo") {
    return "InProgress";
  }

  if (status === "InProgress") {
    return "Done";
  }

  return null;
};

const formatDate = (value) => {
  if (!value) {
    return "No due date";
  }

  return new Date(value).toLocaleDateString();
};

const getAssignedUserId = (assignedTo) => {
  if (!assignedTo) {
    return "";
  }

  return typeof assignedTo === "string" ? assignedTo : assignedTo._id;
};

const getAssignedUserLabel = (assignedTo) => {
  if (!assignedTo) {
    return "Unassigned";
  }

  if (typeof assignedTo === "string") {
    return assignedTo;
  }

  return assignedTo.name || assignedTo.email || assignedTo._id;
};

export default function TaskList({
  tasks,
  currentUserId,
  onStatusUpdate,
  updatingTaskId,
  emptyTitle = "No tasks yet",
  emptyDescription = "Create the first task to start tracking work for this project."
}) {
  if (!tasks.length) {
    return (
      <div className="empty-state-card">
        <p className="empty-state">{emptyTitle}</p>
        <p className="helper-text">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const nextStatus = getNextStatus(task.status);
        const isAssignedUser = getAssignedUserId(task.assignedTo) === currentUserId;

        return (
          <article className="task-card" key={task._id}>
            <div className="task-card-header">
              <h3>{task.title}</h3>
              <span className={`status-badge status-${task.status.toLowerCase()}`}>
                {task.status}
              </span>
            </div>

            <p className="task-description">{task.description || "No description provided."}</p>

            <div className="task-meta">
              <p>
                <strong>Due date:</strong> {formatDate(task.dueDate)}
              </p>
              <p>
                <strong>Assigned user:</strong> {getAssignedUserLabel(task.assignedTo)}
              </p>
            </div>

            <button
              type="button"
              className="task-action-button"
              disabled={!nextStatus || !isAssignedUser || updatingTaskId === task._id}
              onClick={() => onStatusUpdate(task._id, nextStatus)}
            >
              {updatingTaskId === task._id
                ? "Updating..."
                : nextStatus
                  ? `Move to ${nextStatus}`
                  : "Completed"}
            </button>

            {!isAssignedUser ? (
              <p className="helper-text">Only the assigned user can update this task.</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
