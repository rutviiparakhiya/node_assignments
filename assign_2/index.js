const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to Database
connectDB();

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Assignment 2 server running on port ${PORT}`);
});
