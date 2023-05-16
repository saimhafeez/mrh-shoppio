// /customer/wishlist
import express from "express";
import { getWishList, addToWishList, removeFromWishList, isInWishlist } from "../controllers/customerController.js";


const router = express.Router();

router.route('/wishlist').get(getWishList).post(addToWishList).delete(removeFromWishList)
router.route('/wishlist/:productID').get(isInWishlist)

export default router