const path = require("path");

const express = require("express");

const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");
const csrf = require("csurf");

const db = require("./data/database");

const defaultRoutes = require("./routes/default-routes");
const foodRoutes = require("./routes/food-routes");

const MongoDBStore = mongodbStore(session);

const app = express();

const sessionStore = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017",
  databaseName: "fastfood",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(csrf());

app.use(async function (req, res, next) {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next();
  }

  const userDoc = await db.getDb().collection("users").findOne({ _id: user.id });
  const isAdmin = userDoc.isAdmin;

  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin;

  next();
});

app.use("/", defaultRoutes);
app.use("/", foodRoutes);

app.use(function (req, res) {
  res.status(404).render("404");
});

app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
