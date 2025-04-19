const express = require("express");
const router = express.Router();
const Produit = require("../models/produit");
const upload = require('../utils/multerConfig');

// Obtenir tous les produits
router.get("/", async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un produit
router.post("/", async (req, res) => {
  const produit = new Produit({
    name: req.body.name,
    img_produit: req.body.img_produit,
    qte_produit: req.body.qte_produit,
    desc: req.body.desc,
    discount: req.body.discount,
    categorie: req.body.categorie,
    price: req.body.price,
  });

  try {
    const nouveauProduit = await produit.save();
    res.status(201).json(nouveauProduit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour un produit
// router.put("/:id", async (req, res) => {
//   try {
//     const produit = await Produit.findByIdAndUpdate(
//       req.params.id,
//       { nom: req.body.nom, prix: req.body.prix },
//       { new: true }
//     );
//     if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
//     res.status(200).json(produit);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
