import express from "express";
import { getProducts, getSingleProduct, getCategories, getTags, getProductReviews, addProductReview, submitOrder, updateProfile, createNotification, getNotifications, getVendorDetails, markNotificationAsRead, trackOrder } from "../controllers/siteController.js";

const router = express.Router();


router.route('/notification').post(createNotification).get(getNotifications)
router.route('/notification/:id').get(markNotificationAsRead)
router.route('/profile/:id').patch(updateProfile)
router.route('/shop').get(getProducts)
router.route('/order').post(submitOrder)
router.route('/categories').get(getCategories)
router.route('/review').post(addProductReview)
router.route('/review/:id').get(getProductReviews)
router.route('/tags').get(getTags)
router.route('/shop/:id').get(getSingleProduct)
router.route('/vendor').get(getVendorDetails)
router.route('/track-order').get(trackOrder)

export default router