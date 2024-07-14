const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./router/userRouter");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const corsOptions = {
  origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_NETLIFY],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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
