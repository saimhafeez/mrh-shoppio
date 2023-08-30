// /customer/wishlist
import express from "express";
import { getWishList, addToWishList, removeFromWishList, isInWishlist, getCustomerOrders } from "../controllers/customerController.js";


const router = express.Router();

router.route('/wishlist').get(getWishList).post(addToWishList).delete(removeFromWishList)
router.route('/wishlist/:productID').get(isInWishlist)
router.route('/orders').get(getCustomerOrders)

export default router