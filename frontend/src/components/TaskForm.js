import { useState } from "react";

const initialFormState = {
  title: "",
  description: "",
  dueDate: "",
  assignedTo: ""
};

export default function TaskForm({
  projectId,
  members,
  membersLoading,
  onSubmit,
  isSubmitting
}) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isCreated = await onSubmit({
      ...formData,
      projectId
    });

    if (isCreated) {
      setFormData(initialFormState);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <h3>Create Task</h3>
          <p className="helper-text">Assign a task and set a due date for better visibility.</p>
        </div>
      </div>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="3"
      />

      <input
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <select
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        required
      >
        <option value="">
          {membersLoading ? "Loading members..." : "Select assignee"}
        </option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={isSubmitting || membersLoading || !members.length}>
        {isSubmitting ? "Creating..." : "+ Create Task"}
      </button>
    </form>
  );
}
