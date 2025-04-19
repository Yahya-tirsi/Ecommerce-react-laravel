const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    products: [
      {
        image: {
          type: String,
          required: true,
          default: "product-not-found.png",
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);
const statusEnumValues = commandeSchema.path("status").enumValues;



module.exports = {
  Commande: mongoose.model("Commande", commandeSchema),
  statusEnumValues,
};
