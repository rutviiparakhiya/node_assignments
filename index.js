const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./assign_1/src/config/db');

dotenv.config();

// Connect to single DB (sharing the connection across apps if needed, 
// or each app can handle its own if they use different URIs)
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Node Assignments API",
    endpoints: {
      assignment_1: "/assign_1/api/notes",
      assignment_2: "/assign_2/api/notes",
      assignment_3: "/assign_3/api/notes"
    }
  });
});

// Load Assignment Apps
const assign1App = require('./assign_1/src/app');
const assign2App = require('./assign_2/src/app');
const assign3App = require('./assign_3/src/app');

// Mount them as sub-apps
app.use('/assign_1', assign1App);
app.use('/assign_2', assign2App);
app.use('/assign_3', assign3App);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
});
