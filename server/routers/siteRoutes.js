import express from "express";
import { getProducts, getSingleProduct, getCategories, getTags, getProductReviews, addProductReview } from "../controllers/siteController.js";

const router = express.Router();


router.route('/shop').get(getProducts)
router.route('/categories').get(getCategories)
router.route('/review').post(addProductReview)
router.route('/review/:id').get(getProductReviews)
router.route('/tags').get(getTags)
router.route('/shop/:id').get(getSingleProduct)

export default router