const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding ...');

  // Clear old data
  await prisma.unit.deleteMany();
  await prisma.description.deleteMany();
  await prisma.product.deleteMany();
  console.log('🧹 Cleared previous data.');

  // Product Catalog
  const products = [
    {
      name: 'Cauliflower',
      category: 'Vegetable',
      maxOrderLimit: 10,
      allowedUnits: [{ name: '1 pc (400-600 g)', price: 35, discountPercentage: 5 }],
      description: {
        details: 'Firm but soft textured, cauliflower is mild and crispy when cooked.',
        healthBenefits: 'Vitamin C, K & Folates Rich',
        shelfLife: '2 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Potato',
      category: 'Vegetable',
      maxOrderLimit: 20,
      allowedUnits: [
        { name: '1 kg', price: 30, discountPercentage: 10 },
        { name: '500 g', price: 15, discountPercentage: 0 },
      ],
      description: {
        details: 'Staple vegetable, earthy and versatile for any dish.',
        healthBenefits: 'High in potassium and carbs.',
        shelfLife: '5 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Onion (Red)',
      category: 'Vegetable',
      maxOrderLimit: 15,
      allowedUnits: [
        { name: '1 kg', price: 40, discountPercentage: 5 },
        { name: '500 g', price: 20, discountPercentage: 0 },
      ],
      description: {
        details: 'Sharp flavor, essential for Indian curries and salads.',
        healthBenefits: 'Contains antioxidants, supports blood sugar balance.',
        shelfLife: '7 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Tomato',
      category: 'Vegetable',
      maxOrderLimit: 10,
      allowedUnits: [
        { name: '1 kg', price: 50, discountPercentage: 10 },
        { name: '500 g', price: 25, discountPercentage: 0 },
      ],
      description: {
        details: 'Juicy red tomatoes for curries, salads, sauces.',
        healthBenefits: 'Vitamin C & lycopene rich.',
        shelfLife: '4 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Carrot',
      category: 'Vegetable',
      maxOrderLimit: 12,
      allowedUnits: [
        { name: '1 kg', price: 60, discountPercentage: 8 },
        { name: '500 g', price: 30, discountPercentage: 0 },
      ],
      description: {
        details: 'Fresh orange carrots, crunchy and sweet.',
        healthBenefits: 'Good for eyesight (Vitamin A).',
        shelfLife: '6 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Cabbage',
      category: 'Vegetable',
      maxOrderLimit: 8,
      allowedUnits: [{ name: '1 pc (~700 g)', price: 28, discountPercentage: 5 }],
      description: {
        details: 'Leafy green cabbage, fresh and crisp.',
        healthBenefits: 'Good source of Vitamin K and fiber.',
        shelfLife: '5 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Apple (Royal Gala)',
      category: 'Fruit',
      maxOrderLimit: 5,
      allowedUnits: [{ name: '1 kg', price: 200, discountPercentage: 15 }],
      description: {
        details: 'Crisp and sweet apples from best orchards.',
        healthBenefits: 'Rich in antioxidants and fiber.',
        shelfLife: '7 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Banana (Robusta)',
      category: 'Fruit',
      maxOrderLimit: 12,
      allowedUnits: [
        { name: '1 dozen', price: 60, discountPercentage: 5 },
        { name: '6 pcs', price: 30, discountPercentage: 0 },
      ],
      description: {
        details: 'Naturally sweet robusta bananas.',
        healthBenefits: 'High in potassium and fiber.',
        shelfLife: '3 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Mango (Alphonso)',
      category: 'Fruit',
      maxOrderLimit: 6,
      allowedUnits: [{ name: '1 kg (2-3 pcs)', price: 300, discountPercentage: 20 }],
      description: {
        details: 'King of fruits, juicy and aromatic Alphonso mangoes.',
        healthBenefits: 'Vitamin A & C rich.',
        shelfLife: '4 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Premium',
      },
    },
    {
      name: 'Orange (Nagpur)',
      category: 'Fruit',
      maxOrderLimit: 8,
      allowedUnits: [{ name: '1 kg (5-6 pcs)', price: 90, discountPercentage: 10 }],
      description: {
        details: 'Sweet and tangy Nagpur oranges.',
        healthBenefits: 'Boosts immunity with Vitamin C.',
        shelfLife: '5 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Retail',
      },
    },
    {
      name: 'Milk (Full Cream)',
      category: 'Dairy',
      maxOrderLimit: 6,
      allowedUnits: [
        { name: '1 liter', price: 65, discountPercentage: 5 },
        { name: '500 ml', price: 35, discountPercentage: 0 },
      ],
      description: {
        details: 'Fresh and pure full cream milk.',
        healthBenefits: 'High in calcium and protein.',
        shelfLife: '2 days (refrigerated)',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Dairy',
      },
    },
    {
      name: 'Curd',
      category: 'Dairy',
      maxOrderLimit: 6,
      allowedUnits: [
        { name: '500 g pack', price: 40, discountPercentage: 5 },
        { name: '200 g pack', price: 18, discountPercentage: 0 },
      ],
      description: {
        details: 'Thick and creamy natural curd.',
        healthBenefits: 'Probiotic, good for digestion.',
        shelfLife: '3 days (refrigerated)',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Dairy',
      },
    },
    {
      name: 'Paneer (Cottage Cheese)',
      category: 'Dairy',
      maxOrderLimit: 4,
      allowedUnits: [
        { name: '200 g pack', price: 85, discountPercentage: 10 },
        { name: '500 g pack', price: 200, discountPercentage: 12 },
      ],
      description: {
        details: 'Soft, fresh paneer blocks, perfect for curries.',
        healthBenefits: 'Rich in protein and calcium.',
        shelfLife: '3 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Dairy',
      },
    },
    {
      name: 'Rice (Basmati)',
      category: 'Staple',
      maxOrderLimit: 5,
      allowedUnits: [
        { name: '5 kg bag', price: 550, discountPercentage: 10 },
        { name: '1 kg pack', price: 120, discountPercentage: 5 },
      ],
      description: {
        details: 'Premium long-grain basmati rice.',
        healthBenefits: 'Low in fat, gluten-free.',
        shelfLife: '6 months',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Staples',
      },
    },
    {
      name: 'Wheat Flour (Atta)',
      category: 'Staple',
      maxOrderLimit: 5,
      allowedUnits: [
        { name: '5 kg bag', price: 230, discountPercentage: 8 },
        { name: '1 kg pack', price: 50, discountPercentage: 0 },
      ],
      description: {
        details: 'Stone-ground whole wheat flour.',
        healthBenefits: 'High in fiber.',
        shelfLife: '3 months',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Staples',
      },
    },
    {
      name: 'Sugar',
      category: 'Staple',
      maxOrderLimit: 10,
      allowedUnits: [
        { name: '1 kg', price: 45, discountPercentage: 5 },
        { name: '500 g', price: 25, discountPercentage: 0 },
      ],
      description: {
        details: 'Refined white sugar crystals.',
        healthBenefits: 'Quick energy source.',
        shelfLife: '12 months',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Staples',
      },
    },
    {
      name: 'Salt (Iodized)',
      category: 'Staple',
      maxOrderLimit: 10,
      allowedUnits: [
        { name: '1 kg pack', price: 20, discountPercentage: 0 },
      ],
      description: {
        details: 'Fine-grain iodized salt for daily use.',
        healthBenefits: 'Helps prevent iodine deficiency.',
        shelfLife: '12 months',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Staples',
      },
    },
    {
      name: 'Eggs (White)',
      category: 'Poultry',
      maxOrderLimit: 6,
      allowedUnits: [
        { name: '6 pcs pack', price: 45, discountPercentage: 0 },
        { name: '12 pcs pack', price: 85, discountPercentage: 5 },
      ],
      description: {
        details: 'Farm-fresh white eggs.',
        healthBenefits: 'Rich in protein and Vitamin B12.',
        shelfLife: '7 days',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Poultry',
      },
    },
    {
      name: 'Chicken (Curry Cut)',
      category: 'Poultry',
      maxOrderLimit: 3,
      allowedUnits: [
        { name: '500 g pack', price: 160, discountPercentage: 10 },
        { name: '1 kg pack', price: 300, discountPercentage: 12 },
      ],
      description: {
        details: 'Fresh chicken curry cut pieces.',
        healthBenefits: 'High protein source.',
        shelfLife: '2 days (refrigerated)',
        countryOfOrigin: 'India',
        seller: 'VeggieKart Poultry',
      },
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        maxOrderLimit: p.maxOrderLimit,
        allowedUnits: { create: p.allowedUnits },
        description: { create: p.description },
      },
    });
    console.log(`✅ Seeded: ${p.name}`);
  }

  console.log('🌱 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
