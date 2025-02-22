const mongoose = require("mongoose");

const produitSchema = mongoose.Schema({
    name: {type: String, required: true},
    img_produit: {
        img1: {type: String, required: true},
        img2: {type: String, required: true},
        img3: {type: String, required: true},
        img4: {type: String, required: true},
    },
    qte_produit: {type: Number, required: true},
    discount: {type: Number, required: true},
    desc: {type: String, required: true},
    categorie: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model("Produit", produitSchema);