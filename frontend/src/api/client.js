import axios from 'axios';

// The API URL comes from the VITE_API_URL environment variable (see .env.example).
// Nothing is hardcoded, so the same code works locally, in Docker and on AWS.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTasks = () => api.get('/tasks').then((r) => r.data);
export const createTask = (task) =>
  api.post('/tasks', task).then((r) => r.data);
export const updateTask = (id, changes) =>
  api.put(`/tasks/${id}`, changes).then((r) => r.data);
export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data);

// Turns an axios error into a readable message for the UI.
export function errorMessage(err) {
  return err.response?.data?.message || err.message || 'Something went wrong';
}
