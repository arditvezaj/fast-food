const express = require("express");

const router = express.Router();

router.get("/menu", function(req, res) {
    res.render("menu");
})

router.get("/cart", function(req, res) {
    res.render("cart");
});

module.exports = router;