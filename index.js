const { createClient } = require('redis');

let client = null;

async function connectRedis(options = {}) {
  if (client) return client;
  const url = options.url;
  if (!url) {
    throw new Error('Redis URL is required. Pass it as options.url.');
  }

  client = createClient({
    ...options,
    url
  });

  client.on('error', (err) => console.error('? Redis Client Error', err));

  await client.connect();
  console.log('? Connected to Redis');

  return client;
}

function getClient() {
  if (!client) {
    throw new Error('Redis client not initialized');
  }
  return client;
}

async function setCache(key, value, ttlInSec = 3600) {
  const c = getClient();
  await c.set(key, JSON.stringify(value), { EX: ttlInSec });
}

async function getCache(key) {
  const c = getClient();
  const data = await c.get(key);
  return data ? JSON.parse(data) : null;
}

async function deleteCache(key) {
  const c = getClient();
  await c.del(key);
}

module.exports = () => ({
  connectRedis,
  getClient,
  setCache,
  getCache,
  deleteCache
});