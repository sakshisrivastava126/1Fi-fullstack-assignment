import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:slug", getProductBySlug);

export default router;
