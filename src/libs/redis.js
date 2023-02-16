import redis from "redis"
import { promisify } from "util"

const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT
})

client.connect()
  .then(async (res) => {
    console.log('connected');
    // Write your own code here

    // Example
    const value = await client.lRange('data', 0, -1);
    console.log(value.length);
    console.log(value);
    client.quit();
  })
  .catch((err) => {
    console.log('¡Hubo un error! El error es: ' + err);
  });

export const GET_REDIS_ASYNC = promisify(client.get).bind(client)
export const SET_REDIS_ASYNC = promisify(client.set).bind(client)
