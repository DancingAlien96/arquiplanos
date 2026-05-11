import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Define la variable MONGODB_URI en .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Evita múltiples conexiones en desarrollo con hot-reload
const globalWithCache = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = { conn: null, promise: null };
}

const cache = globalWithCache.mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
