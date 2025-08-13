const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 }
});

const DescriptionSchema = new mongoose.Schema({
  unit: String,
  details: String,
  healthBenefits: String,
  serveSize: String,
  shelfLife: String,
  returnPolicy: String,
  countryOfOrigin: String,
  seller: String,
  sellerFSSAI: String,
  foodAdditivesInfo: String,
  disclaimer: String,
  customerCareDetails: {
    email: String
  }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  allowedUnits: [UnitSchema], 
  maxOrderLimit: { type: Number, default: 10 },
  description: DescriptionSchema // Use the new sub-schema here
});

module.exports = mongoose.model('Product', ProductSchema);
