// Commenting out Redis implementation for now
/*
const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Connect to redis
const connectRedis = async () => {
    await redisClient.connect();
};

connectRedis();

module.exports = redisClient;
*/

// Providing a mock redis client to prevent errors
module.exports = {
    get: async () => null,
    set: async () => null,
    connect: async () => null
}; 