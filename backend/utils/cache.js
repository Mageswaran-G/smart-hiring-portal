// Simple in-memory cache
// Works like a dictionary: key → { data, expiry time }

const cache = {};

// Save data to cache
// key = name, ttl = how many seconds to keep
const setCache = (key, data, ttlSeconds = 300) => {
  cache[key] = {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000
  };
};

// Get data from cache
// Returns null if not found or expired
const getCache = (key) => {
  const item = cache[key];
  if (!item) return null;

  // Check if expired
  if (Date.now() > item.expiresAt) {
    delete cache[key]; // clean up expired item
    return null;
  }

  return item.data;
};

// Delete one cache item (use after data changes)
const deleteCache = (key) => {
  delete cache[key];
};

// Delete all cache items that start with a prefix
// Example: deleteByPrefix('jobs') deletes jobs:page1, jobs:page2, etc.
const deleteByPrefix = (prefix) => {
  Object.keys(cache).forEach(key => {
    if (key.startsWith(prefix)) delete cache[key];
  });
};

module.exports = { setCache, getCache, deleteCache, deleteByPrefix };