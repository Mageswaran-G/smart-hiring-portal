const { deleteByPrefix } = require('./cache');

module.exports = function invalidateAICache(userId) {
  deleteByPrefix(`batch:${userId}`);
  deleteByPrefix(`jobats:${userId}`);
  deleteByPrefix(`recommendations:${userId}`);
};
