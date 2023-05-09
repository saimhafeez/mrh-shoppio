import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import ProductReview from "../models/ProductReview.js";
import User from "../models/User.js";


const getProducts = async (req, res) => {


    console.log(req.query)

    // var queryObject = {
    //     $or: []
    // }
    var queryObject = {}

    const filterType = req.query.filterType

    delete req.query.filterType

    // console.log(req.query)
    // console.log(orList, andList)


    // considering i get non-empty query filters only
    const keys = Object.keys(req.query);

    console.log('keys', keys)

    if (keys.length > 0) {
        queryObject[filterType == 'any' ? '$or' : '$and'] = []
    }

    for (const key of keys) {

        console.log('key', key)

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

    console.log('queryObject', queryObject)

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

    let result = Product.find(queryObject)


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

    console.log(req.params)

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


export { getProducts, getSingleProduct, getCategories, getTags, getProductReviews, addProductReview }