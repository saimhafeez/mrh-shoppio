import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import ProductReview from "../models/ProductReview.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import BadRequestError from "../errors/bad-request.js";
import mongoose from "mongoose";


const getProducts = async (req, res) => {


    // console.log(req.query)

    // var queryObject = {
    //     $or: []
    // }
    var queryObject = {}

    const filterType = req.query.filterType

    const search = req.query.search

    delete req.query.filterType
    delete req.query.search

    // console.log(req.query)
    // console.log(orList, andList)


    // considering i get non-empty query filters only
    const keys = Object.keys(req.query);

    // console.log('keys', keys)

    if (keys.length > 0) {
        queryObject[filterType == 'any' ? '$or' : '$and'] = []
    }

    for (const key of keys) {

        // console.log('key', key)

        const values = req.query[key].split(',')

        console.log('values', values)


        // var filteringKey;

        // if (orList) {

        //     for (const item of orList) {
        //         if (item == key) {
        //             filteringKey = '$or'
        //             break;
        //         }
        //     }
        // }

        // if (andList) {
        //     for (const item of andList) {
        //         if (item == key) {
        //             filteringKey = '$and'
        //             break;
        //         }
        //     }
        // }

        // console.log('filteringKey', filteringKey)

        queryObject[filterType == 'any' ? '$or' : '$and'].push({
            [key]: { '$in': values }
        })

        // queryObject[key] = { $in: values }

        // console.log('queryObject[key]', queryObject[key])

    }

    // if (queryObject.$or && queryObject.$or.length === 0) {
    //     delete queryObject.$or
    // }

    // if (queryObject.$and && queryObject.$and.length === 0) {
    //     delete queryObject.$and
    // }

    // console.log('queryObject', queryObject)

    // const greaterThan = null;
    // const lessThan = null;

    // queryObject = {
    //     '$or': [
    //         {
    //             categories: {
    //                 '$all': ['duck', '2023']
    //             }
    //         },
    //         { tags: { '$in': ['new'] } }
    //     ],
    //     '$and': [
    //         { price: { $gte: greaterThan || 0, $lte: lessThan || Infinity } }
    //     ]
    // }
    // queryObject = {
    //     '$or': [{ tags: { '$in': ['rog'] } }],
    //     categories: { '$in': ['asus'] }
    // }

    console.log('queryObject', queryObject)



    let result = search ? Product.find(
        { name: { $regex: search, $options: "i" } }
    ) : Product.find(queryObject)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 90
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;

    const totalProducts = await Product.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalProducts / limit);

    res.status(StatusCodes.OK).json({
        products,
        totalProducts,
        numOfPages
    })




    // const { vendorId } = req.query

    // const queryObject = {}

    // // add filters
    // if (vendorId) {
    //     queryObject.vendorId = vendorId;
    // }

    // let result = Product.find(queryObject)

    // // TODO chain sort funtion later

    // const page = Number(req.query.page) || 1
    // const limit = Number(req.query.limit) || 2
    // const skip = (page - 1) * limit;

    // result = result.skip(skip).limit(limit);

    // const products = await result;

    // const totalProducts = await Product.countDocuments(queryObject)
    // const numOfPages = Math.ceil(totalProducts / limit);

    // res.status(StatusCodes.OK).json({
    //     products,
    //     totalProducts,
    //     numOfPages
    // })

}

const getSingleProduct = async (req, res) => {

    // console.log(req.params)

    const { id: productID } = req.params

    const product = await Product.findOne({ _id: productID });

    if (!product) {
        throw new NotFoundError(`No product with id: ${productID}`);
    }

    res.status(StatusCodes.OK).json({
        product: product._doc
    })
}


const getCategories = async (req, res) => {


    const result = await Product.aggregate([
        {
            $unwind: '$categories'
        },
        {
            $group: {
                _id: '$categories',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])

    res.status(StatusCodes.OK).json({
        categories: result
    })
}

const getTags = async (req, res) => {


    const result = await Product.aggregate([
        {
            $unwind: '$tags'
        },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])

    res.status(StatusCodes.OK).json({
        tags: result
    })
}

const getProductReviews = async (req, res) => {
    const { id: productID } = req.params

    const product = await Product.findOne({ _id: productID });
    if (!product) {
        throw new NotFoundError(`No product with id: ${productID}`);
    }

    const previews = await ProductReview.find({ productID });

    const productReviews = []

    for (const preview of previews) {

        const customer = await User.findOne({ _id: preview.customerID })

        if (!customer) {
            throw new NotFoundError(`No user with id: ${preview.customerID}`);
        }

        productReviews.push({
            customerName: customer.name,
            rating: preview.rating,
            review: preview.review,
        })
    }

    const reviewCount = await ProductReview.countDocuments({ productID });

    res.status(StatusCodes.OK).json({
        productReviews,
        reviewCount
    })

}

const addProductReview = async (req, res) => {

    const productReview = await ProductReview.create(req.body);

    res.status(StatusCodes.OK).json({ productReview })
}

const submitOrder = async (req, res) => {

    const { cart, customerID, shippingAddress } = req.body

    // console.log('submitOrder', { cart, customerID, shippingAddress })

    const productOrders = []

    for (const item of cart) {

        const { vendorId, stock } = await Product.findById(item.productId);

        await Product.findByIdAndUpdate(
            { _id: item.productId },
            { stock: stock - item.quantity }
        )

        var order = {
            vendorID: vendorId.toString(),
            shippingAddress,
            products: []
        }

        if (customerID) {
            order.customerID = customerID
        }

        const newProduct = {
            productID: item.productId,
            quantity: item.quantity
        }

        if (productOrders.length === 0) {
            order.products.push(newProduct)
            productOrders.push(order)
        } else {

            var flag_vendorIdFound = false;

            for (const existingOrder of productOrders) {
                if (existingOrder.vendorID === vendorId.toString()) {
                    existingOrder.products.push(newProduct)
                    flag_vendorIdFound = true
                }
            }

            if (!flag_vendorIdFound) {
                order.products.push(newProduct)
                productOrders.push(order)
            }

        }

        // orders.push(vendorId.toString())

    }

    var orders = []

    for (const productOrder of productOrders) {
        const order = await Order.create(productOrder);
        orders.push(order)
    }


    res.status(StatusCodes.OK).json({ orders, ordersCount: orders.length })
}

const updateProfile = async (req, res) => {
    try {
        const { profileUrl, name, email } = req.body;
        const { id } = req.params;

        const user = {}

        if (profileUrl) {
            user.profileUrl = profileUrl
        }

        if (name) {
            user.name = name
        }

        if (email) {
            user.email = email
        }

        const updatedUser = await User.findOneAndUpdate({ _id: id }, user, { new: true })

        if (!updatedUser) {
            throw new NotFoundError(`No user with id: ${id}`);
        }

        res.status(StatusCodes.OK).json({ updatedUser })

    } catch (error) {
        console.log(error)
    }

}

const createNotification = async (req, res) => {

    const notification = await Notification.create(req.body);

    res.status(StatusCodes.OK).json({
        notification
    })

}

const getNotifications = async (req, res) => {
    const { userID } = req.query;

    const notifications = await Notification.find({
        userID
    })

    const count = await Notification.countDocuments({
        userID
    }).sort({ isRead: -1, createdAt: -1 })

    res.status(StatusCodes.OK).json({
        notifications,
        count
    })
}

const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;

    const notification = Notification.findById(id);

    if (!notification) {
        throw new NotFoundError(`no notification with id ${id}`)
    }

    Notification.findByIdAndUpdate(id, {
        isRead: true
    })

    res.status(StatusCodes.OK).json({
        msg: 'notification marked'
    })

}

const getVendorDetails = async (req, res) => {
    const { vendorId, productId } = req.query;

    var vendorID;

    if (productId) {
        const product = await Product.findById(productId);


        if (!product) {
            throw new NotFoundError(`no product with id ${productId}`);
        }

        vendorID = product.vendorId;
    } else {
        if (!vendorId) {
            throw new BadRequestError(`provide vendor id or product id in the query`)
        }
        vendorID = vendorId
    }

    const vendor = {}

    vendor.vendorInfo = await User.findById(vendorID);

    if (!vendor.vendorInfo) {
        throw new NotFoundError(`no vendor with id ${vendorID}`);
    }

    // calculate positive review  
    const vendorProductList = await Product.find({ vendorId: vendorID })

    vendor.popularProducts = await Product.aggregate([
        {
            $match: {
                vendorId: new mongoose.Types.ObjectId(vendorID),
            },
        },
        {
            $lookup: {
                from: "productreviews", // Assuming the collection name for ProductReview is "productreviews"
                localField: "_id",
                foreignField: "productID",
                as: "reviews",
            },
        },
        {
            $addFields: {
                reviewCount: { $size: "$reviews" },
                totalRating: {
                    $sum: "$reviews.rating",
                },
                averageRating: {
                    $avg: "$reviews.rating",
                },
            },
        },
        {
            $sort: {
                totalRating: -1,
                reviewCount: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);

    var vendorRating = 0;
    var reviewCounts = 0;

    vendor.reviews = []

    for (const product of vendorProductList) {
        const productReview = await ProductReview.find({ productID: product._id });
        if (productReview.length !== 0 && productReview) {

            for (const review of productReview) {
                vendorRating += review.rating;
                reviewCounts++;

                const customer = await User.findById(review.customerID)

                vendor.reviews.push({
                    productName: product.name,
                    productImage: product.images[0],
                    review,
                    customer
                })
            }

            // productReviews.push(productReview)
        }
    }

    vendor.rating = vendorRating / (5 * reviewCounts) * 100;

    res.status(StatusCodes.OK).json({
        vendor
    })
}

const trackOrder = async (req, res) => {
    const { id } = req.query;

    const order = await Order.findById(id);

    const prdts = [];
    for (const product of order.products) {
        const prdt = await Product.findById(product.productID);

        prdts.push({
            product: prdt,
            quantity: product.quantity
        })
    }

    res.status(StatusCodes.OK).json({
        order: {
            _id: order._id,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            status: order.status,
            shippingAddress: order.shippingAddress,
            products: prdts
        }
    })
}


export { getProducts, getSingleProduct, getCategories, getTags, getProductReviews, addProductReview, submitOrder, updateProfile, createNotification, getNotifications, markNotificationAsRead, getVendorDetails, trackOrder }