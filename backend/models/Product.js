const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  allowedUnits: [UnitSchema], 
  maxOrderLimit: { type: Number, default: 10 } 
});

module.exports = mongoose.model('Product', ProductSchema);