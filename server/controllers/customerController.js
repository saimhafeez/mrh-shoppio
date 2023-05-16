import { StatusCodes } from "http-status-codes";
import WishList from "../models/WishList.js";
import Product from "../models/Product.js";

const getWishList = async (req, res) => {
    const { customerId } = req.query
    let result = WishList.find(
        { customerId }
    )
    const wishlist = await result;

    const products = []
    var count = 0;

    for (const item of wishlist) {
        const product = await Product.findOne({
            _id: item.productID
        })
        products.push(product)
        count++
    }

    res.status(StatusCodes.OK).json({
        products,
        count
    })
}

const addToWishList = async (req, res) => {
    const { customerID, productID } = req.query

    const wishlist = WishList.create({ customerID, productID })

    res.status(StatusCodes.OK).json({
        wishlist
    })
}

const removeFromWishList = async (req, res) => {
    const { customerID, productID } = req.query

    const wishlist = await WishList.deleteOne({ customerID, productID })

    res.status(StatusCodes.OK).json({
        wishlist
    })
}

const isInWishlist = async (req, res) => {
    const { customerID } = req.query
    const { productID } = req.params

    const result = await WishList.findOne({ customerID, productID })

    res.status(StatusCodes.OK).json({
        result
    })
}

export { getWishList, addToWishList, removeFromWishList, isInWishlist }