// seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = [
  {
    "name": "Tomato",
    "category": "vegetable",
    "subcategory": "fruit vegetable",
    "imageUrl": "https://example.com/images/tomato.jpg",
    "images": [
      { "url": "https://example.com/images/tomato.jpg", "alt": "Fresh tomatoes", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 kg", "price": 40, "discountPercentage": 10, "stock": 100, "isAvailable": true },
      { "name": "500 g", "price": 22, "discountPercentage": 0, "stock": 50, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "1 kg",
      "details": "Firm, juicy red tomatoes perfect for salads, curries, and sauces.",
      "healthBenefits": "Rich in Vitamin C, antioxidants, and lycopene.",
      "serveSize": "100g",
      "shelfLife": "5 days",
      "returnPolicy": "The product is non-returnable. Damaged or incorrect items can be replaced within 48 hours if unused and in original condition.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["tomato", "vegetable", "fresh"],
    "rating": { "average": 4.5, "count": 120 },
    "isActive": true,
    "isFeatured": true
  },
  {
    "name": "Cucumber",
    "category": "vegetable",
    "subcategory": "gourd vegetable",
    "imageUrl": "https://example.com/images/cucumber.jpg",
    "images": [
      { "url": "https://example.com/images/cucumber.jpg", "alt": "Fresh cucumbers", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 kg", "price": 30, "discountPercentage": 5, "stock": 80, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "1 kg",
      "details": "Crisp and refreshing cucumbers ideal for salads and raita.",
      "healthBenefits": "Hydrating and rich in Vitamin K.",
      "serveSize": "100g",
      "shelfLife": "7 days",
      "returnPolicy": "The product is non-returnable. Damaged or incorrect items can be replaced within 48 hours if unused and in original condition.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["cucumber", "vegetable", "fresh"],
    "rating": { "average": 4.4, "count": 90 },
    "isActive": true,
    "isFeatured": false
  },
  {
    "name": "Carrot",
    "category": "vegetable",
    "subcategory": "root vegetable",
    "imageUrl": "https://example.com/images/carrot.jpg",
    "images": [
      { "url": "https://example.com/images/carrot.jpg", "alt": "Fresh carrots", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 kg", "price": 45, "discountPercentage": 5, "stock": 70, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "1 kg",
      "details": "Sweet and crunchy carrots perfect for juicing and cooking.",
      "healthBenefits": "High in beta-carotene, good for eyesight.",
      "serveSize": "100g",
      "shelfLife": "10 days",
      "returnPolicy": "The product is non-returnable. Damaged or incorrect items can be replaced within 48 hours if unused and in original condition.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["carrot", "vegetable", "fresh"],
    "rating": { "average": 4.6, "count": 110 },
    "isActive": true,
    "isFeatured": false
  },
  {
    "name": "Cauliflower",
    "category": "vegetable",
    "subcategory": "cruciferous vegetable",
    "imageUrl": "https://example.com/images/cauliflower.jpg",
    "images": [
      { "url": "https://example.com/images/cauliflower.jpg", "alt": "Fresh cauliflower", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 pc (400-600 g)", "price": 35, "discountPercentage": 0, "stock": 60, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, mild and crispy when cooked.",
      "healthBenefits": "Rich in Vitamin C, K & Folates.",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable unless damaged, rotten or incorrect within 48 hours.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Every effort is made to maintain the accuracy of all information.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["cauliflower", "vegetable", "fresh"],
    "rating": { "average": 4.3, "count": 80 },
    "isActive": true,
    "isFeatured": false
  },
  {
    "name": "Potato",
    "category": "vegetable",
    "subcategory": "root vegetable",
    "imageUrl": "https://example.com/images/potato.jpg",
    "images": [
      { "url": "https://example.com/images/potato.jpg", "alt": "Fresh potatoes", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 kg", "price": 25, "discountPercentage": 0, "stock": 200, "isAvailable": true }
    ],
    "maxOrderLimit": 10,
    "description": {
      "unit": "1 kg",
      "details": "Starchy, versatile potatoes for cooking, frying, and baking.",
      "healthBenefits": "Source of potassium, Vitamin C, and fiber.",
      "serveSize": "100g",
      "shelfLife": "20 days",
      "returnPolicy": "Non-returnable unless damaged or incorrect.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["potato", "vegetable", "fresh"],
    "rating": { "average": 4.7, "count": 250 },
    "isActive": true,
    "isFeatured": true
  },
  {
    "name": "Onion",
    "category": "vegetable",
    "subcategory": "bulb vegetable",
    "imageUrl": "https://example.com/images/onion.jpg",
    "images": [
      { "url": "https://example.com/images/onion.jpg", "alt": "Fresh onions", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 kg", "price": 30, "discountPercentage": 0, "stock": 150, "isAvailable": true }
    ],
    "maxOrderLimit": 10,
    "description": {
      "unit": "1 kg",
      "details": "Pungent, flavorful onions used in almost every cuisine.",
      "healthBenefits": "Contains antioxidants, supports heart health.",
      "serveSize": "100g",
      "shelfLife": "15 days",
      "returnPolicy": "Non-returnable unless damaged or incorrect.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["onion", "vegetable", "fresh"],
    "rating": { "average": 4.6, "count": 210 },
    "isActive": true,
    "isFeatured": true
  },
  {
    "name": "Spinach",
    "category": "vegetable",
    "subcategory": "leafy green",
    "imageUrl": "https://example.com/images/spinach.jpg",
    "images": [
      { "url": "https://example.com/images/spinach.jpg", "alt": "Fresh spinach", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "250 g", "price": 20, "discountPercentage": 0, "stock": 40, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "250 g",
      "details": "Tender green spinach leaves rich in nutrients.",
      "healthBenefits": "High in iron, Vitamin K, and antioxidants.",
      "serveSize": "50g",
      "shelfLife": "3 days",
      "returnPolicy": "Non-returnable unless damaged or incorrect.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["spinach", "leafy", "fresh"],
    "rating": { "average": 4.5, "count": 75 },
    "isActive": true,
    "isFeatured": false
  },
  {
    "name": "Capsicum",
    "category": "vegetable",
    "subcategory": "fruit vegetable",
    "imageUrl": "https://example.com/images/capsicum.jpg",
    "images": [
      { "url": "https://example.com/images/capsicum.jpg", "alt": "Fresh capsicum", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "500 g", "price": 60, "discountPercentage": 5, "stock": 30, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "500 g",
      "details": "Bright, crunchy capsicums perfect for stir fry and salads.",
      "healthBenefits": "Rich in Vitamin C and antioxidants.",
      "serveSize": "100g",
      "shelfLife": "7 days",
      "returnPolicy": "Non-returnable unless damaged or incorrect.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["capsicum", "vegetable", "fresh"],
    "rating": { "average": 4.4, "count": 50 },
    "isActive": true,
    "isFeatured": false
  },
  {
    "name": "Brinjal",
    "category": "vegetable",
    "subcategory": "fruit vegetable",
    "imageUrl": "https://example.com/images/brinjal.jpg",
    "images": [
      { "url": "https://example.com/images/brinjal.jpg", "alt": "Fresh brinjals", "isPrimary": true }
    ],
    "allowedUnits": [
      { "name": "1 kg", "price": 35, "discountPercentage": 0, "stock": 60, "isAvailable": true }
    ],
    "maxOrderLimit": 5,
    "description": {
      "unit": "1 kg",
      "details": "Smooth, purple brinjals ideal for curries and roasting.",
      "healthBenefits": "Good source of fiber and antioxidants.",
      "serveSize": "100g",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable unless damaged or incorrect.",
      "countryOfOrigin": "India",
      "customerCare": "Email: info@blinkit.com",
      "disclaimer": "Product details may vary slightly from packaging.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED",
      "sellerFSSAI": "10020064002537"
    },
    "tags": ["brinjal", "vegetable", "fresh"],
    "rating": { "average": 4.2, "count": 40 },
    "isActive": true,
    "isFeatured": false
  }
];

mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("Connected to MongoDB");
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Database seeded successfully!");
  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
