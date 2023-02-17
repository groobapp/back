import redis from "redis"
import { promisify } from "util"

const client = redis.createClient({ host: process.env.REDISHOST, port: process.env.REDISPORT })

client.on("connect", function () {
  console.log("redis connected");
});
client.on("error", (error) => {
  console.error(error);
});

export const GET_REDIS_ASYNC = async (key) => {
  const getAsync = promisify(client.get).bind(client);
  const value = await getAsync(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};

export const SET_REDIS_ASYNC = async (key, value, expiration) => {
  const setAsync = promisify(client.set).bind(client);
  const expireAsync = promisify(client.expire).bind(client);
  const response = await setAsync(key, JSON.stringify(value));
  await expireAsync(key, expiration ? expiration : 60 * 45);
  return response;
};
