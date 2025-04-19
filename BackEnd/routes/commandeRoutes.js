const express = require("express");
const { Commande, statusEnumValues } = require("../models/commandes");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  const { client, products, totalPrice } = req.body;
  try {
    const newCommande = new Commande({
      client,
      products,
      totalPrice,
    });
    const savedCommande = await newCommande.save();
    res.status(201).json(savedCommande);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create order. Please try again." });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate("client", "username email")
    res.status(200).json(commandes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch orders. Please try again." });
  }
});


// Get orders for a specific user
// router.get("/user/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const commandes = await Commande.find({ client: userId })
//       .populate("client", "username email") // Populate user details
//       .populate("products.product", "name price img_produit"); // Populate product details
//     res.status(200).json(commandes);
//   } catch (err) {
//     console.error("Error fetching user orders:", err); // Debugging log
//     res
//       .status(500)
//       .json({ error: "Failed to fetch user orders. Please try again." });
//   }
// }); 

// Get a single order by ID
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const commande = await Commande.findById(id)
//       .populate("client", "username email") // Populate user details
//       .populate("products.product", "name price"); // Populate product details
//     if (!commande) {
//       return res.status(404).json({ error: "Order not found." });
//     }
//     res.status(200).json(commande);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch order. Please try again." });
//   }
// });

// Update an order
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     const updatedCommande = await Commande.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
//     if (!updatedCommande) {
//       return res.status(404).json({ error: "Order not found." });
//     }
//     res.status(200).json(updatedCommande);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to update order. Please try again." });
//   }
// });

// Delete an order
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCommande = await Commande.findByIdAndDelete(id);
    if (!deletedCommande) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json({ message: "Order deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete order. Please try again." });
  }
});

// Update an order
router.put('/:id',async(req,res)=>{
  try{
        const updateOrder = await Commande.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json(updateOrder);
  }catch(error){
        res.status(500).json({error:error.message});
  }
})

router.get("/statusoptions", (req, res) => {
  res.json(statusEnumValues);
});

module.exports = router;
