const express = require("express");
const router = express.Router();
const weatherRoutes = require("./weather");
const timeRoutes = require("./time");
const airportRoutes = require("./airports");
const analyticsRoutes = require("./analytic");
const chatRoutes = require("./chat");
const uploadRoutes = require("./upload");
const redditRoutes = require("./reddit");
const coinRoutes = require("./coin");
const authRoutes = require("./auth");
const paymentRoutes = require("./payment");

router.use("/weather", weatherRoutes);
router.use("/time", timeRoutes);
router.use("/airports", airportRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/chat", chatRoutes);
router.use("/upload", uploadRoutes);
router.use("/reddit", redditRoutes);
router.use("/coin", coinRoutes);
router.use("/auth", authRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
