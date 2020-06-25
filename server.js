const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const userRouter = require('./routes/user')
const connectDB = require('./db/db');
const { request } = require("express");
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: "./config/dev.env" });
}


const app = express();

// Mounting middleware
// app.use(express.json())
// Mounting routers
app.use('/api/v1/users', userRouter)



const PORT = process.env.PORT || 5000;
const start = () => {
  connectDB()
  app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`.cyan);
  });
};
module.exports = { app, start };
