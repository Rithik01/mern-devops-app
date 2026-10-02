import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description });
    setTitle('');
    setDescription('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add task</button>
    </form>
  );
}
