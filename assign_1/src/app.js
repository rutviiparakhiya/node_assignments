const express = require("express");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/note.routes");

// Remove dotenv.config() and move to root if needed
// dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Mount routes
app.use("/api/notes", noteRoutes);

// Generic 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
  });
});

module.exports = app;
