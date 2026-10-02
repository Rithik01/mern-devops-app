import mongoose from 'mongoose';

// Connects to MongoDB using the MONGO_URI environment variable.
// The URI is never hardcoded, so the same code works locally,
// in Docker Compose (mongodb://mongo:27017/...) and on AWS (e.g. MongoDB Atlas).
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
