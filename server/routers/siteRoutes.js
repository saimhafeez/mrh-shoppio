import express from "express";
import { getProducts, getSingleProduct, getCategories, getTags, getProductReviews, addProductReview, submitOrder, updateProfile, createNotification, getNotifications, getVendorDetails } from "../controllers/siteController.js";

const router = express.Router();


router.route('/notification').post(createNotification).get(getNotifications)
router.route('/profile/:id').patch(updateProfile)
router.route('/shop').get(getProducts)
router.route('/order').post(submitOrder)
router.route('/categories').get(getCategories)
router.route('/review').post(addProductReview)
router.route('/review/:id').get(getProductReviews)
router.route('/tags').get(getTags)
router.route('/shop/:id').get(getSingleProduct)
router.route('/vendor').get(getVendorDetails)

export default router