const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./assign_1/src/config/db');

// Load environment variables if any
dotenv.config();

const app = express();
app.use(express.json());

// Import individual assignment apps
const assign1 = require('./assign_1/src/app');
const assign2 = require('./assign_2/src/app');
const assign3 = require('./assign_3/src/app');

// Mount the assignments on specific routes
app.use('/assign_1', assign1);
app.use('/assign_2', assign2);
app.use('/assign_3', assign3);

// Default route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Node Assignments</title></head>
      <body>
        <h1>Node Assignments Dashboard</h1>
        <ul>
          <li><a href="/assign_1/api/notes">Assignment 1 (CRUD) - /assign_1/api/notes</a></li>
          <li><a href="/assign_2/api/notes">Assignment 2 (Advanced) - /assign_2/api/notes</a></li>
          <li><a href="/assign_3/api/notes">Assignment 3 (Search) - /assign_3/api/notes</a></li>
        </ul>
        <p>Status: All systems operational</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 10000;

// Connect to DB and Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Master server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to DB", err);
    app.listen(PORT, () => {
        console.log(`Master server running on port ${PORT} (DB Connection Failed)`);
    });
});
