const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI && process.env.NODE_ENV === 'production') {
      console.error('FATAL ERROR: MONGO_URI is not defined in production.');
      process.exit(1);
    }

    if (mongoURI) {
      try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected to provided URI...');
        return;
      } catch (err) {
        console.log('Failed to connect to primary MongoDB URI.');
        if (process.env.NODE_ENV === 'production' || !mongoURI.includes('localhost')) {
          console.error(err.message);
          process.exit(1);
        }
      }
    }

    console.log('Spinning up Zero-Config In-Memory MongoDB for local development...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    console.log(`In-Memory MongoDB Connected at ${uri}`);
    
    console.log('Auto-seeding local demo database...');
    const seedDatabase = require('../seed');
    await seedDatabase();
    console.log('Mock local setup complete, ready to serve!');
    
  } catch (err) {
    console.error('Database Initialization failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
