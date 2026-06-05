const express = require("express");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/note.routes");

// dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/notes", noteRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", data: null });
});

module.exports = app;
