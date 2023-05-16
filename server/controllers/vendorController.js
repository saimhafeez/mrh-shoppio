import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'

import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
    const { vendorId } = req.query

    const ordersSet = await Order.find({ vendorID: vendorId })

    const orders = []

    for (const orderSet of ordersSet) {

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

    const updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        { $set: { status: orderStatus } },
        { new: true }
    )

    res.status(StatusCodes.OK).json({ updatedOrder });
}


export { getProducts, createProduct, uploadImages, getOrders, updateOrderStatus }