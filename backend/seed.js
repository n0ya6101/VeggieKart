require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { 
    name: 'Potato', 
    category: 'Vegetable', 
    maxOrderLimit: 20,
    allowedUnits: [
      { name: '1 kg', price: 30, discountPercentage: 10 }, // 10% discount
      { name: '500 g', price: 15 },
    ]
  },
  { 
    name: 'Onion', 
    category: 'Vegetable', 
    maxOrderLimit: 10,
    allowedUnits: [
      { name: '1 kg', price: 35 },
      { name: '500 g', price: 18 },
    ]
  },
  { 
    name: 'Apple (Royal Gala)', 
    category: 'Fruit', 
    maxOrderLimit: 5,
    allowedUnits: [
      { name: '1 kg', price: 200, discountPercentage: 15 }, // 15% discount
    ]
  },
  // ... (add other products as needed)
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();