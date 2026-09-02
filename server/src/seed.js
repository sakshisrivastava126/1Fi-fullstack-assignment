import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const TENURES = [
  { tenure: 3, interestRate: 0 },
  { tenure: 6, interestRate: 0 },
  { tenure: 12, interestRate: 0 },
  { tenure: 24, interestRate: 0 },
  { tenure: 36, interestRate: 10.5 },
  { tenure: 48, interestRate: 10.5 },
  { tenure: 60, interestRate: 10.5 },
];

const buildEmiPlans = (price, cashback) =>
  TENURES.map(({ tenure, interestRate }) => {
    const monthlyRate = interestRate / 12 / 100;
    const monthlyPayment =
      monthlyRate === 0
        ? price / tenure
        : (price * monthlyRate * (1 + monthlyRate) ** tenure) /
          ((1 + monthlyRate) ** tenure - 1);

    return {
      monthlyPayment: Math.round(monthlyPayment),
      tenure,
      interestRate,
      cashback,
    };
  });

const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    description:
      "Apple's flagship with the A19 Pro chip, a titanium frame and a 48MP Pro camera system.",
    active: true,
    variants: [
      {
        name: "256GB Silver",
        mrp: 134900,
        price: 127400,
        image: "/images/iphone-17-pro-silver.jpg",
        emiPlans: buildEmiPlans(127400, 7500),
      },
      {
        name: "256GB Cosmic Orange",
        mrp: 134900,
        price: 127400,
        image: "/images/iphone-17-pro-orange.jpg",
        emiPlans: buildEmiPlans(127400, 7500),
      },
      {
        name: "512GB Deep Blue",
        mrp: 154900,
        price: 146900,
        image: "/images/iphone-17-pro-blue.jpg",
        emiPlans: buildEmiPlans(146900, 7500),
      },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "Titanium build, a 200MP camera and a built-in S Pen, powered by Snapdragon 8 Gen 3.",
    active: true,
    variants: [
      {
        name: "256GB Titanium Black",
        mrp: 129999,
        price: 114999,
        image: "/images/galaxy-s24-ultra-black.jpg",
        emiPlans: buildEmiPlans(114999, 6000),
      },
      {
        name: "512GB Titanium Gray",
        mrp: 139999,
        price: 124999,
        image: "/images/galaxy-s24-ultra-gray.jpg",
        emiPlans: buildEmiPlans(124999, 6000),
      },
    ],
  },
  {
    name: "OnePlus 13",
    slug: "oneplus-13",
    description:
      "Snapdragon 8 Elite, a 6000mAh battery and 100W fast charging in an aluminium frame.",
    active: true,
    variants: [
      {
        name: "256GB Midnight Ocean",
        mrp: 69999,
        price: 64999,
        image: "/images/oneplus-13-ocean.jpg",
        emiPlans: buildEmiPlans(64999, 3500),
      },
      {
        name: "512GB Arctic Dawn",
        mrp: 76999,
        price: 71999,
        image: "/images/oneplus-13-dawn.jpg",
        emiPlans: buildEmiPlans(71999, 3500),
      },
    ],
  },
  {
    name: "Google Pixel 9 Pro",
    slug: "google-pixel-9-pro",
    description:
      "Discontinued demo listing kept inactive to show how hidden products are filtered out.",
    active: false,
    variants: [
      {
        name: "128GB Obsidian",
        mrp: 109999,
        price: 94999,
        image: "/images/pixel-9-pro-obsidian.jpg",
        emiPlans: buildEmiPlans(94999, 5000),
      },
      {
        name: "256GB Porcelain",
        mrp: 119999,
        price: 104999,
        image: "/images/pixel-9-pro-porcelain.jpg",
        emiPlans: buildEmiPlans(104999, 5000),
      },
    ],
  },
];

const seed = async () => {
  try {
    await connectDB();

    for (const product of products) {
      await Product.findOneAndUpdate({ slug: product.slug }, product, {
        upsert: true,
        runValidators: true,
      });
    }

    console.log(`Seeded ${products.length} products`);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
