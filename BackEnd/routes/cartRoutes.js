const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

// Ajouter un produit to cart
router.post("/", async (req, res) => {
  const { client, name, image, price, quantity } = req.body;

  const cart = new Cart({
    client,
    name,
    image,
    price,
    quantity
  });

  try {
    const nouveauCart = await cart.save();
    res.status(201).json(nouveauCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get orders for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const commandes = await Cart.find({ client: userId })
      .populate("client", "username email")
    res.status(200).json(commandes);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch user orders. Please try again." });
  }
});

// Supprimer un cart
router.delete("/:id", async (req, res) => {
  try {
    const produit = await Cart.findByIdAndDelete(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Supprimer tout les produit dans cart
router.delete("/", async (req, res) => {
  try {
    const produit = await Cart.deleteMany(req.params);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json({ message: "Tout les produits supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
