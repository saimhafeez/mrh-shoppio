import mongoose from "mongoose";


const WishListSchema = new mongoose.Schema(
    {
        productID: {
            type: String,
            required: [true, 'Please Provide ProductID'],
        },
        customerID: {
            type: String,
            required: [true, 'Please Provide customerID'],
        }
    },
    { timestamps: true }
)

export default mongoose.model('WishList', WishListSchema)