// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error("Error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
}

module.exports = errorHandler;
