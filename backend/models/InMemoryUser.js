const bcrypt = require('bcryptjs');

// In-memory storage for users when MongoDB is not available
class InMemoryUserStore {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async create(userData) {
    const id = this.nextId++;
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = {
      _id: id,
      id: id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      isActive: true,
      favoriteArticles: [],
      preferences: {
        newsletter: true,
        notifications: true
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };

    // Add methods to the user object
    user.comparePassword = async (candidatePassword) => {
      return await this.comparePassword(candidatePassword, user.password);
    };

    user.updateLastLogin = async () => {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.users.set(id, user);
      return user;
    };

    user.save = async () => {
      user.updatedAt = new Date();
      this.users.set(id, user);
      return user;
    };

    // Add virtual properties
    Object.defineProperty(user, 'fullName', {
      get: function() {
        return `${this.firstName} ${this.lastName}`;
      }
    });

    this.users.set(id, user);
    return user;
  }

  async findByEmail(email) {
    const user = Array.from(this.users.values()).find(
      u => u.email === email.toLowerCase()
    );
    return user || null;
  }

  async findById(id) {
    return this.users.get(parseInt(id)) || null;
  }

  async updateById(id, updateData) {
    const user = this.users.get(parseInt(id));
    if (!user) return null;

    Object.assign(user, updateData, { updatedAt: new Date() });
    this.users.set(parseInt(id), user);
    return user;
  }

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Helper methods to match Mongoose API
  async save() {
    return this;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Global in-memory store instance
const inMemoryStore = new InMemoryUserStore();

// Mock User model that mimics Mongoose but uses in-memory storage
const InMemoryUser = {
  async create(userData) {
    return await inMemoryStore.create(userData);
  },

  async findByEmail(email) {
    return await inMemoryStore.findByEmail(email);
  },

  async findById(id) {
    const user = await inMemoryStore.findById(id);
    if (!user) return null;

    // Add methods to the user object to mimic Mongoose document
    user.comparePassword = async function(candidatePassword) {
      return await inMemoryStore.comparePassword(candidatePassword, this.password);
    };

    user.updateLastLogin = async function() {
      this.lastLogin = new Date();
      return await inMemoryStore.updateById(this._id, { lastLogin: this.lastLogin });
    };

    user.save = async function() {
      return await inMemoryStore.updateById(this._id, this);
    };

    // Add virtual properties
    Object.defineProperty(user, 'fullName', {
      get: function() {
        return `${this.firstName} ${this.lastName}`;
      }
    });

    return user;
  },

  // Static methods
  statics: {
    findByEmail: function(email) {
      return InMemoryUser.findByEmail(email);
    }
  }
};

module.exports = { InMemoryUser, inMemoryStore };