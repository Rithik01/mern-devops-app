// 404 for any route that doesn't exist.
export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler. Express recognizes it by its 4 arguments.
export function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error (e.g. missing title) -> 400
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (status === 500) console.error(err);

  res.status(status).json({ message });
}
