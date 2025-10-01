const mongoose = require('mongoose');
const { InMemoryUser } = require('./InMemoryUser');

// Try to determine if we're connected to MongoDB
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Create a unified User interface
const User = {
  // Create user
  async create(userData) {
    if (isMongoConnected()) {
      const MongoUser = require('./User');
      const user = new MongoUser(userData);
      return await user.save();
    } else {
      return await InMemoryUser.create(userData);
    }
  },

  // Find by email
  async findByEmail(email) {
    if (isMongoConnected()) {
      const MongoUser = require('./User');
      return await MongoUser.findByEmail(email);
    } else {
      return await InMemoryUser.findByEmail(email);
    }
  },

  // Find by ID
  async findById(id) {
    if (isMongoConnected()) {
      const MongoUser = require('./User');
      return await MongoUser.findById(id);
    } else {
      return await InMemoryUser.findById(id);
    }
  }
};

module.exports = User;