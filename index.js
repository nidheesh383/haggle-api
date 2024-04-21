const path = require("path");
const express = require("express");
require("dotenv").config({
  override: true,
  path: path.join(__dirname, ".env"),
});
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const auth = require("./routes/auth");

// Define routes
app.use(cors());
app.use(require("./middleware/errorHandler"));
app.get("/getUserName", (req, res) => {
  res.send("right!");
});
app.use("/auth", auth);

// Database Connection Initialization
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to database");
  client.query("SELECT current_user", (err, result) => {
    release(); // release the client back to the pool
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Current user:", result.rows[0].current_user);
  });
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
