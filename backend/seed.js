require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products= [
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  },
  {
    "name": "Cauliflower",
    "category": "Vegetable",
    "maxOrderLimit": 10,
    "allowedUnits": [
      {
        "name": "1 pc (400-600 g)",
        "price": 35,
        "discountPercentage": 5
      }
    ],
    "description": {
      "unit": "1 pc (400-600 g)",
      "details": "Firm but soft textured, cauliflower is mild and crispy when cooked. It goes well with bright, vibrant ingredients such as lemons and capers. Widely used in North Indian dishes like \"Gobhi ka paratha\" and \"Aloo Gobhi\" due to its versatility.",
      "healthBenefits": "Vitamin C, K & Folates Rich",
      "serveSize": "Serves 2-3",
      "shelfLife": "2 days",
      "returnPolicy": "Non-returnable. For damaged, rotten or incorrect items, request replacement within 48 hours of delivery.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Actual product may vary in size and color from images shown.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives or artificial colors."
    }
  },
  {
    "name": "Potato",
    "category": "Vegetable",
    "maxOrderLimit": 20,
    "allowedUnits": [
      {
        "name": "1 kg",
        "price": 30,
        "discountPercentage": 10
      },
      {
        "name": "500 g",
        "price": 15
      }
    ],
    "description": {
      "unit": "1 kg",
      "details": "Potatoes are a staple vegetable, known for their versatility in various dishes. Fresh and earthy, sourced from trusted farms.",
      "healthBenefits": "Rich in potassium and Vitamin C. Good source of carbohydrates for energy.",
      "serveSize": "Serves 4-5",
      "shelfLife": "5 days",
      "returnPolicy": "Non-returnable except for damaged or incorrect products within 48 hours.",
      "countryOfOrigin": "India",
      "customerCareDetails": {
        "email": "info@blinkit.com"
      },
      "disclaimer": "Some variation in size and color is natural in fresh produce.",
      "seller": "ZOMATO HYPERPURE PRIVATE LIMITED, Shop no- 2,3 & 4 Kohinoor Luxuria, Plot No 4/A-2, Poona Link Road, Between Chaki Naka & Suchak Naka, Netivali Tiles Market, Kalyan (E) 421306",
      "sellerFSSAI": "10020064002537",
      "foodAdditivesInfo": "No added preservatives."
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');
    await Product.deleteMany({});
    console.log('Old products cleared.');
    await Product.insertMany(products);
    console.log('Database seeded successfully with new data!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();