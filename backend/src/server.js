import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
// 0.0.0.0 = listen on all network interfaces. Required inside Docker/AWS:
// if we listened only on localhost, nothing outside the container could reach us.
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`API listening on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
