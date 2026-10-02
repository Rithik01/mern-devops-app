import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add your first one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
