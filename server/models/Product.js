import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Product Name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please Provide Product Description'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please Provide Product Price'],
        trim: true
    },
    images: [{
        type: String,
        required: [true, 'Please Provide Product Images']
    }],
    categories: [{
        type: String,
        required: [true, 'Please Provide atleast one Product Category'],
        trim: true
    }],
    tags: [{
        type: String,
        required: [true, 'Please Provide atleast one Product Tag'],
        trim: true
    }],
    vendorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'provide vendor id']
    }
})

export default mongoose.model('Product', ProductSchema)