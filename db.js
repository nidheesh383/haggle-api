// db.js (or any file where you set up your database connection)
const { Pool } = require("pg");

// Create a new pool instance
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "haggle",
  password: "n211149k",
  port: 6000, // Default PostgreSQL port
});

module.exports = pool;
