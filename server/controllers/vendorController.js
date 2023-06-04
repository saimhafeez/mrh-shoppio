import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ProductReview from "../models/ProductReview.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'

import multiparty from 'multiparty'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import mime from 'mime-types'

const bucketName = 'shoppio'

const getProducts = async (req, res) => {

    const { vendorId } = req.query

    // if (!user) {
    //     throw new UnAuthenticatedError('login and try again')
    // }

    const queryObject = {}

    // add filters
    if (vendorId) {
        queryObject.vendorId = vendorId;
    }

    let result = Product.find(queryObject)

    // TODO chain sort funtion later

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 2
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

}

const createProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        stock,
        images,
        categories,
        tags
    } = req.body

    // provide all fields error

    req.body.vendorId = req.user.userId;

    console.log('vendor body', req.body);

    const product = await Product.create(req.body)

    res.status(StatusCodes.OK).json({ product })

}

const uploadImages = async (req, res) => {

    const form = new multiparty.Form();

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

    console.log('files', files);

    console.log(process.env.S3_ACCESS_KEY, process.env.S3_SECRET_ACCESS_KEY);

    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });

    const links = []

    for (const file of files.file) {

        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;

        console.log(newFilename);

        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path)
        }));

        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link)
    }

    res.status(StatusCodes.OK).json({ links })
}

const getOrders = async (req, res) => {
    const { vendorId, sort, status } = req.query

    var ordersSet;

    if (status && status !== 'all') {
        ordersSet = Order.find({
            vendorID: vendorId,
            status: status
        })
    } else {
        ordersSet = Order.find({ vendorID: vendorId })
    }



    if (sort && sort === 'oldest') {
        ordersSet.sort({ createdAt: 1 })
    } else {
        ordersSet.sort({ createdAt: -1 });
    }

    const result = await ordersSet

    const orders = []

    for (const orderSet of result) {

        const products = [];

        for (const product of orderSet.products) {

            const pdt = await Product.findById(product.productID);

            products.push({
                product: pdt,
                quantity: product.quantity
            })
        }

        orders.push({
            ...orderSet._doc,
            products: products
        })
    }

    res.status(StatusCodes.OK).json({ orders })
}

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body

    const order = await Order.findById(id);

    if (!order) {
        throw new NotFoundError(`no such order with id ${id}`)
    }

    if (order.status === 'returned' && orderStatus !== 'returned') {
        for (const item of order.products) {
            await Product.findByIdAndUpdate(
                { _id: item.productID },
                { $inc: { stock: -item.quantity } }
            );
        }
    } else if (order.status !== 'returned' && orderStatus === 'returned') {
        for (const item of order.products) {
            await Product.findByIdAndUpdate(
                { _id: item.productID },
                { $inc: { stock: item.quantity } }
            );
        }
    }

    const updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        { $set: { status: orderStatus } },
        { new: true }
    )

    res.status(StatusCodes.OK).json({ updatedOrder });
}

const getSaleStats = async (req, res) => {
    const { sales, salesPeriod } = req.query

    const { userId } = req.user

    console.log({ salesPeriod, userId })

    const queryObject = {}

    if (salesPeriod) {
        // handles default 'today'
        var startDate = new Date();
        var endDate = new Date();

        if (salesPeriod === 'last7days') {
            startDate.setDate(startDate.getDate() - 6);
        } else if (salesPeriod === 'last30days') {
            startDate.setDate(startDate.getDate() - 30);
        } else if (salesPeriod === 'lastyear') {
            startDate.setFullYear(startDate.getFullYear() - 1)
        }
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        const orders = await Order.find({
            vendorID: userId,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({
            createdAt: -1
        })

        var totalSale = 0
        for (const orderSet of orders) {
            for (const product of orderSet.products) {
                const pdt = await Product.findById(product.productID);
                totalSale += pdt.price * product.quantity
            }
        }

        res.status(StatusCodes.OK).json({
            orders,
            totalSale
        })
    }
}

const getProductStats = async (req, res) => {
    const { userId } = req.user

    const orders = await Order.find({
        vendorID: userId,
    }).sort({
        createdAt: -1
    })

    var productsCount = 0
    var productStats = [];

    for (const orderSet of orders) {


        for (const product of orderSet.products) {

            productsCount += product.quantity

            const pdt = await Product.findById(product.productID);

            for (const stats of productStats) {
                if (stats.productID && (stats.productID === product.productID)) {
                    stats.count += product.quantity
                }
            }

            productStats.push({
                productID: product.productID,
                quantitySold: product.quantity,
                name: pdt.name,
            })
        }
    }

    const popularProduct = productStats.sort(function (a, b) { return b.quantitySold - a.quantitySold })[0]

    res.status(StatusCodes.OK).json({
        productsCount,
        popularProduct
    })
}

const getReviewStats = async (req, res) => {

    const { userId } = req.user

    const vendorProducts = await Product.find({ vendorId: userId });

    const reviews = []
    var count = 0;

    for (const product of vendorProducts) {
        const reviewList = await ProductReview.find({ productID: product._id })
        if (reviewList.length > 0) {
            count += reviewList.length;

            var totalRating = 0;
            for (const review of reviewList) {
                totalRating += review.rating;
            }

            reviews.push({
                product: product.name,
                avgRating: totalRating / reviewList.length
            })
        }
    }

    res.status(StatusCodes.OK).json({
        reviews: reviews.sort((a, b) => b.avgRating - a.avgRating),
        count
    })
}

const getProductSalesGraphData = async (req, res) => {
    const { userId } = req.user;

    const orders = await Order.find({ vendorID: userId });

    const graphData = []

    for (const order of orders) {

        var productsCount = 0;

        for (const item of order.products) {
            productsCount += item.quantity;
        }

        const date = new Date(order.createdAt);
        const simpleDate = date.toLocaleDateString(undefined, {
            month: 'numeric',
            day: 'numeric'
        });

        var isAlreadyinGraphData = false
        for (const graphdata of graphData) {
            if (graphdata.Day === simpleDate) {
                isAlreadyinGraphData = true
                graphdata.ProductsSold += productsCount
            }
        }

        if (!isAlreadyinGraphData) {
            graphData.push({
                ProductsSold: productsCount,
                Day: simpleDate
            })
        }

    }

    res.status(StatusCodes.OK).json({
        graphData
    })

}

const getProfitGraphData = async (req, res) => {
    const { userId } = req.user;

    const orders = await Order.find({ vendorID: userId });

    const graphData = []

    for (const order of orders) {

        var profit = 0;

        for (const item of order.products) {

            const product = await Product.findById(item.productID);

            profit += item.quantity * product.price;
        }


        const date = new Date(order.createdAt);
        const simpleDate = date.toLocaleDateString(undefined, {
            month: 'numeric',
            day: 'numeric'
        });

        var isAlreadyinGraphData = false
        for (const graphdata of graphData) {
            if (graphdata.Day === simpleDate) {
                isAlreadyinGraphData = true
                graphdata.ProfitMade += profit
            }
        }

        if (!isAlreadyinGraphData) {
            graphData.push({
                ProfitMade: profit,
                Day: simpleDate,
            })
        }

    }

    res.status(StatusCodes.OK).json({
        graphData
    })
}

const getOrderStatusGraphData = async (req, res) => {
    const { userId } = req.user;

    const orders = await Order.find({ vendorID: userId }).sort({
        updatedAt: 1
    });

    const graphData = []

    for (const order of orders) {

        const date = new Date(order.updatedAt);
        const simpleDate = date.toLocaleDateString(undefined, {
            month: 'numeric',
            day: 'numeric'
        });

        var isAlreadyinGraphData = false
        for (const graphdata of graphData) {
            if (graphdata.Day === simpleDate) {
                isAlreadyinGraphData = true
                graphdata[order.status] += 1
            }
        }

        if (!isAlreadyinGraphData) {
            graphData.push({
                pending: order.status === 'pending' ? 1 : 0,
                shipped: order.status === 'shipped' ? 1 : 0,
                received: order.status === 'received' ? 1 : 0,
                returned: order.status === 'returned' ? 1 : 0,
                Day: simpleDate
            })
        }

    }

    res.status(StatusCodes.OK).json({
        graphData
    })
}

const updateProduct = async (req, res) => {
    const { stock, id } = req.query;

    const product = await Product.findById(id);

    if (!product) {
        throw new NotFoundError(`no product with id ${id}`)
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        { $inc: { stock: stock } },
        { new: true }
    )

    res.status(StatusCodes.OK).json({ updatedProduct })
}

const removeProduct = async (req, res) => {

    const { id } = req.query;

    const product = await Product.findById(id);

    if (!product) {
        throw new NotFoundError(`no product with id ${id}`)
    }

    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });

    for (const link of product.images) {
        const objectKey = link.split("/")[link.split("/").length - 1]

        await client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objectKey
        }));
    }

    const removedProduct = await Product.findByIdAndDelete(id)

    res.status(StatusCodes.OK).json({ removedProduct })
}


export { getProducts, createProduct, uploadImages, getOrders, updateOrderStatus, getSaleStats, getProductStats, getReviewStats, getProductSalesGraphData, getProfitGraphData, getOrderStatusGraphData, updateProduct, removeProduct }