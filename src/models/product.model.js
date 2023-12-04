
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    category: String,
    imageUrl: {type: String, required: true},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"}
}, {timestamps: true})

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;