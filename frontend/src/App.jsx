import { useCallback, useEffect, useState } from 'react';
import * as api from './api/client.js';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setError('');
      setTasks(await api.getTasks());
    } catch (err) {
      setError(api.errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Run an API call, then refresh the list. Shows errors in the UI.
  async function run(action) {
    try {
      setError('');
      await action();
      await loadTasks();
    } catch (err) {
      setError(api.errorMessage(err));
    }
  }

  return (
    <main className="container">
      <h1>Task Manager</h1>
      <h2>Hiiiiii, My name is Rithik</h2>
      <TaskForm onCreate={(task) => run(() => api.createTask(task))} />

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={(t) =>
            run(() => api.updateTask(t._id, { completed: !t.completed }))
          }
          onUpdate={(t, changes) => run(() => api.updateTask(t._id, changes))}
          onDelete={(t) => run(() => api.deleteTask(t._id))}
        />
      )}
    </main>
  );
}
