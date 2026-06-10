import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// Initialize Redis client using the URL from environment variables
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

redisClient.on("connect", () => {
  console.log("Connected to Redis!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
