import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

function getCache(): MongooseCache {
  if (!global.__mongooseCache) {
    global.__mongooseCache = { conn: null, promise: null };
  }
  return global.__mongooseCache;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim().length > 0) return uri.trim();
  return 'mongodb://localhost:27017';
}

function isConnectionAlive(): boolean {
  const readyState = mongoose.connection.readyState;
  return readyState === 1 || readyState === 2;
}

async function connectDB(): Promise<typeof mongoose> {
  const cached = getCache();

  if (cached.conn && isConnectionAlive()) {
    return cached.conn;
  }

  if (cached.conn && !isConnectionAlive()) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts: Parameters<typeof mongoose.connect>[1] = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
    };

    cached.promise = mongoose.connect(getMongoUri(), opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { connectDB, getMongoUri };
export type { MongooseCache };