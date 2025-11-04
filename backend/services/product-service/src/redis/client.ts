import Redis from 'ioredis';

let redis: Redis;

export const getRedisClient = (): Redis => {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
    console.log('✅ Redis connected');
  }
  return redis;
};