import Redis from "ioredis";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Redis(process.env.REDIS_URL);

export default client;
