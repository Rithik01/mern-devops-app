import mongoose from 'mongoose';
import Task from '../models/Task.js';

// Small helper: returns a 404-style error that the error middleware understands.
function notFound() {
  const err = new Error('Task not found');
  err.status = 404;
  return err;
}

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error('Invalid task id');
    err.status = 400;
    throw err;
  }
}

// Only allow the fields we expect (ignore anything else in the request body).
function pickFields(body) {
  const fields = {};
  for (const key of ['title', 'description', 'completed']) {
    if (body[key] !== undefined) fields[key] = body[key];
  }
  return fields;
}

export async function getTasks(_req, res) {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
}

export async function getTask(req, res) {
  assertValidId(req.params.id);
  const task = await Task.findById(req.params.id);
  if (!task) throw notFound();
  res.json(task);
}

export async function createTask(req, res) {
  const task = await Task.create(pickFields(req.body));
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  assertValidId(req.params.id);
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    pickFields(req.body),
    { new: true, runValidators: true },
  );
  if (!task) throw notFound();
  res.json(task);
}

export async function deleteTask(req, res) {
  assertValidId(req.params.id);
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw notFound();
  res.json({ message: 'Task deleted' });
}
