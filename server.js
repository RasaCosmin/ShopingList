const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const users = require("./routes/api/users");

const app = express();

app.use(logger("dev"));

//body parser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

const dbConfig = require("./config/keys").mongoURI;
mongoose
  .connect(
    dbConfig,
    { useNewUrlParser: true }
  )
  .then(() => console.log("db connected"))
  .catch(err => console.log(err));

app.use("/api/users", users);
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server run on port ${port}`));
