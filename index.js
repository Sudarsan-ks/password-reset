const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./router/userRouter");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// const corsOptions = {
//   origin: ['http://localhost:5173', 'https://main--jocular-griffin-b49ff1.netlify.app'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

app.use(cors());

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welocome to Password Reset Flow");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected");
    app.listen(PORT, () => {
      console.log(`Server has started in port no ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Message:", err);
  });
