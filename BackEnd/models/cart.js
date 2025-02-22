const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true},
});

module.exports = mongoose.model("Cart", cartSchema);
