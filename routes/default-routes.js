const express = require("express");

const bcrypt = require("bcryptjs");

const db = require("../data/database");
const csrf = require("csurf");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index", { csrfToken: req.csrfToken() });
});

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/signup", function (req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  req.session.inputData = null;

  const csrfToken = req.csrfToken();
  res.render("signup", { inputData: sessionInputData, csrfToken: csrfToken });
});

router.get("/login", function (req, res) {
    let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  req.session.inputData = null;

  const csrfToken = req.csrfToken();
  res.render("login", { inputData: sessionInputData, csrfToken: csrfToken });
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredName = userData.name;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;
  const enteredConfirmPassword = userData.confirmPassword;

  if (
    !enteredName ||
    !enteredEmail ||
    !enteredPassword ||
    !enteredConfirmPassword ||
    !enteredEmail.includes("@") ||
    enteredPassword.trim() < 6 ||
    enteredPassword !== enteredConfirmPassword
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - check your data.",
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    };

    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "User exists already!",
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);
  const hashedConfirmPassword = await bcrypt.hash(enteredConfirmPassword, 12);

  const user = {
    name: enteredName,
    email: enteredEmail,
    password: hashedPassword,
    confirmPassword: hashedConfirmPassword,
  };

  await db.getDb().collection("users").insertOne(user);

  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (!existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log in - please check your credentials!",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: "Could not log in - please check your credentials!!",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/");
  });
});

router.get("/admin", function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  if(!res.locals.isAdmin) {
    return res.status(403).render("403");
  }
  res.render("admin");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;

  const csrfToken = req.csrfToken();
  res.redirect("/");
});

module.exports = router;
