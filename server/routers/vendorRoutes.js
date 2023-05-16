import express from "express";
import { getProducts, createProduct, uploadImages, getOrders, updateOrderStatus } from "../controllers/vendorController.js";

const router = express.Router();

router.route('/uploadImage').post(uploadImages)
router.route('/product').post(createProduct)
router.route('/products').get(getProducts).post(createProduct)
router.route('/orders').get(getOrders)
router.route('/order/:id').post(updateOrderStatus)

export default router