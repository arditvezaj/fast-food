const express = require("express");

const router = express.Router();

const foodData = require("../util/food-data");

router.get("/menu", function(req, res) {
    res.render("menu");
})

router.get("/cart", function(req, res) {
    res.render("cart");
});

router.get("/users", function(req, res) {

    const storedUsers = foodData.getStoredData();
    res.render("users", { users: storedUsers});
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/users", function(req, res) {
    const user = req.body;
    const storedUsers = foodData.getStoredData();
    
    storedUsers.push(user);

    foodData.storeData(storedUsers);

    res.redirect("/users");
});

module.exports = router;