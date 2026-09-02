import mongoose from "mongoose";

const emiPlanSchema = new mongoose.Schema({
  monthlyPayment: { type: Number, required: true, min: 0 },
  tenure: { type: Number, required: true, min: 1 },
  interestRate: { type: Number, required: true, min: 0 },
  cashback: { type: Number, required: true, min: 0 },
});

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mrp: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true, trim: true },
  emiPlans: {
    type: [emiPlanSchema],
    validate: (plans) => plans.length > 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    variants: {
      type: [variantSchema],
      validate: (variants) => variants.length > 0,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
