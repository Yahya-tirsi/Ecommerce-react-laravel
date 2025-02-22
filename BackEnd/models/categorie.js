const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
    nameCategory: { type: String, required: true, unique: true },
    imageCategory: { type: String, required: true },
    description: { type: String, default: "" }
});

module.exports = mongoose.model('Categorie', categorieSchema);
