const express = require("express");
const router = express.Router();

const homeController = require("../../controllers/public/homeController");

// Public Home API
router.get("/", homeController.getHomeData);

module.exports = router;