const express = require("express");
const mongoose = require("mongoose");

const activeListsRoutes = require("./routes/activeLists");
const listsRoutes = require("./routes/lists");
const userRoutes = require("./routes/user");

require("dotenv").config();
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;
const PORT = 8080;

const app = express();

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

app.use("/activeLists", activeListsRoutes);
app.use("/lists", listsRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const title = error.title || "An error has occurred...";
  res.status(status).json({ message: message, title: title });
});

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.1rnui.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log(`Your server is running on port ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
