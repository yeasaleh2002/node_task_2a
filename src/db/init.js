const Airport = require('../models/airport');
const db = require('./index');

async function initializeDatabase() {
  try {
    // Create airports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS airports (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(3) NOT NULL UNIQUE,
        latitude DECIMAL(10, 7) NOT NULL,
        longitude DECIMAL(10, 7) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert initial airports
    await Airport.insertAll(Airport.initialAirports);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase().then(() => process.exit(0));
}

module.exports = initializeDatabase; 