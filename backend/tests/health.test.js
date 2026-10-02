// Runs with Node's built-in test runner: `npm test` (no extra libraries needed).
// Starts the app on a random port and calls the health endpoint.
// It does NOT need MongoDB, so it works in CI without a database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('GET /api/health returns { status: "ok" }', async () => {
  const server = app.listen(0);
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
  } finally {
    server.close();
  }
});

test('unknown route returns 404 JSON', async () => {
  const server = app.listen(0);
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/api/nope`);
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});
