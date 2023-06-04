import express from "express";
import { getProducts, createProduct, uploadImages, getOrders, updateOrderStatus, getSaleStats, getProductStats, getReviewStats, getProductSalesGraphData, getProfitGraphData, getOrderStatusGraphData, updateProduct, removeProduct } from "../controllers/vendorController.js";

const router = express.Router();

router.route('/uploadImage').post(uploadImages)
router.route('/product').post(createProduct).patch(updateProduct).delete(removeProduct)
router.route('/products').get(getProducts).post(createProduct)
router.route('/orders').get(getOrders)
router.route('/order/:id').post(updateOrderStatus)
router.route('/stats/sales').get(getSaleStats)
router.route('/stats/products').get(getProductStats)
router.route('/stats/reviews').get(getReviewStats)
router.route('/stats/graphdata/sales').get(getProductSalesGraphData)
router.route('/stats/graphdata/profit').get(getProfitGraphData)
router.route('/stats/graphdata/orders').get(getOrderStatusGraphData)

export default router