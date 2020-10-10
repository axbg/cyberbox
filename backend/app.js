let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let session = require("client-sessions");
let middlewares = require("./public/controllers/middlewares");
let auth = require("./public/controllers/auth");

let models = require("./public/models");
let index = require("./routes/index");

models.sequelize.sync();

let app = express();

//app.use(fileUploader());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/*", function (req, res, next) {
  res.header("Cache-Control", "no-cache, no-store");
  next();
});

app.post("/*", function (req, res, next) {
  res.header("Cache-Control", "no-cache, no-store");
  next();
});

app.use(
  session({
      cookieName: "session",
      secret:"AUTH_SECRET",
    duration: 432000000, //5 days cookie example
    activeDuration: 172800000, //2 days renewal example
    httpOnly: true,
    ephemeral: false,
    secure: false,
  })
);

app.post("/auth/glogin", auth.gLogin);
app.post("/auth/logout", middlewares.LogInCheck, auth.Logout);

app.use("/api", middlewares.LogInCheck, index);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../.", "front", "index.html"));
});

app.use(express.static(path.resolve(__dirname, "../.", "front")));

app.get("*", function (req, res) {
  res.status(404).send("what???");
});

module.exports = app;
