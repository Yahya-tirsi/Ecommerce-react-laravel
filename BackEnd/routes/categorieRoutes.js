const express = require("express");
// const multer = require("multer");
// const path = require("path");
const router = express.Router();
const Category = require("../models/categorie");

// Configurer le stockage Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Dossier où les images seront stockées
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique pour éviter les doublons
//     },
// });

// Initialiser Multer
// const upload = multer({ storage });


// Ajouter un produit
router.post("/", async (req, res) => {
  const category = new Category({
    nameCategory: req.body.nameCategory,
    imageCategory: req.body.imageCategory,
    description: req.body.description,
  });

  try {
    const nouveauCategory = await category.save();
    res.status(201).json(nouveauCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtenir tous les categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un categorie
router.delete("/:id", async (req, res) => {
  try {
    const produit = await Category.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
