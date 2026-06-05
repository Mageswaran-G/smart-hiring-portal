const mongoose = require('mongoose');

const connectTestDB = async () => {
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
};

const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clearCollections = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { connectTestDB, disconnectTestDB, clearCollections };
