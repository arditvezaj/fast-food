const express = require("express");

const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/about", function (req, res) {
  res.render("about");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

router.get("/login", function (req, res) {
  res.render("login");
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
    return res.redirect("/signup");
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

    if (existingUser) {
        return res.redirect("/signup");
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
    return res.redirect("/login");
  }

  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    return res.redirect("/login");
  }

  res.redirect("/");
});

module.exports = router;
