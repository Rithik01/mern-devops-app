import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// CORS_ORIGIN lets you restrict which website may call this API
// (e.g. your frontend's URL on AWS). "*" (allow all) is fine for learning.
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Health check: used by Docker HEALTHCHECK and later by AWS load balancers.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
