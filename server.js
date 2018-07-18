const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const users = require("./routes/api/users");
const shoppingList = require("./routes/api/shoppingList");

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

app.use(passport.initialize());
//passport config
require("./config/passport")(passport);

app.use("/api", users);
app.use("/api/list", shoppingList);
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server run on port ${port}`));
