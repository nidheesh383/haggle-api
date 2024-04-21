const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Assuming you have a pool instance set up for PostgreSQL
const pool = require("../db"); // Import your PostgreSQL pool instance

// Route handler for user login
router.post(
  "/login",
  [
    // Validate username and password
    body("username").trim().notEmpty().isEmail(),
    body("password").trim().notEmpty(),
  ],
  async (req, res) => {
    // Test the database connection
    const { rows } = await pool.query("SELECT NOW()");
    console.log(
      "Database connection test successful. Current time:",
      rows[0].now
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Log the username and password after validation
    console.log("Username:", req.body.username);
    console.log("Password:", req.body.password);

    const { username, password } = req.body;

    try {
      // Query the database for the user
      const query = "SELECT * FROM users WHERE username = $1";
      const { rows } = await pool.query(query, [username]);

      // Check if user exists
      if (rows.length === 0) {
        console.log("User not found:", username);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = rows[0];
      console.log("Retrieved user from database:", user);

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      // Check if passwords match
      if (passwordMatch) {
        // If passwords match, send success response with additional data
        const userData = {
          id: user.id,
          email: user.username,
          // Add more fields as needed
        };
        return res.status(200).json({
          message: "Login successful",
          user: userData,
          // Add more data as needed
        });
      } else {
        console.log("Incorrect password for user:", username);
        return res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (err) {
      console.error("Error during login:", err.message);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
);

module.exports = router;
