import express from "express";
import { getProducts, createProduct, uploadImages } from "../controllers/vendorController.js";

const router = express.Router();

router.route('/uploadImage').post(uploadImages)
router.route('/product').post(createProduct)
router.route('/products').get(getProducts).post(createProduct)

export default router