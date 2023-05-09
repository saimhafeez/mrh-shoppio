import mongoose from "mongoose";
import validator from "validator";


const ProductReviewSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: [true, 'Please Provide ProductID'],
    },
    customerID: {
        type: String,
        required: [true, 'Please Provide customerID'],
    },
    review: {
        type: String,
        required: [true, 'Please Provide review'],
    },
    rating: {
        type: Number,
        required: [true, 'Please Provide rating']
    }
})

export default mongoose.model('ProductReview', ProductReviewSchema)