import express from "express";
import { getProducts, getCategories, getTags } from "../controllers/siteController.js";

const router = express.Router();


router.route('/shop').get(getProducts)
router.route('/categories').get(getCategories)
router.route('/tags').get(getTags)

export default router