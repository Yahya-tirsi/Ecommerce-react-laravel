const express = require("express");
// const multer = require("multer");
// const path = require("path");
const Client = require("../models/clients");
const router = express.Router();

// Obtenir tous les categories
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
