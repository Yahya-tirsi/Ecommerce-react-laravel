const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");

// Obtenir tous les produits
router.get("/", async (req, res) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;