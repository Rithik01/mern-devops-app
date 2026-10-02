import { useState } from 'react';

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  function save() {
    if (!title.trim()) return;
    onUpdate(task, { title, description });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="task-item">
        <div className="task-body">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="task-actions">
          <button onClick={save}>Save</button>
          <button className="secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label="Mark completed"
      />
      <div className="task-body">
        <strong>{task.title}</strong>
        {task.description && <span>{task.description}</span>}
      </div>
      <span className={`badge ${task.completed ? 'completed' : 'pending'}`}>
        {task.completed ? 'Completed' : 'Pending'}
      </span>
      <div className="task-actions">
        <button className="secondary" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </li>
  );
}
