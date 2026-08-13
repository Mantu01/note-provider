import mongoose from "mongoose";
import { AppError } from "../lib/errors";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as typeof globalThis & { __mongoose?: MongooseCache };

const cache: MongooseCache = globalCache.__mongoose ?? { conn: null, promise: null };
globalCache.__mongoose = cache;

export async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw AppError.internal("Database is not configured");

    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(uri, { bufferCommands: false, maxPoolSize: 10 });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
