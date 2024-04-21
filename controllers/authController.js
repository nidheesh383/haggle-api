const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to retrieve user information
    const query =
      "SELECT id, username, password FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      // User not found
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    // Compare passwords
    if (password !== user.password) {
      // Passwords don't match
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Passwords match, send success response
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
