import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        vendorID: {
            type: String,
            required: [true, 'Please provide vendor id']
        },
        customerID: {
            type: String,
            default: 'non-customer'
        },
        products: [{
            productID: {
                type: String,
                required: [true, 'Please provide product id']
            },
            quantity: {
                type: Number,
                required: [true, 'Please provide product quantity']
            }
        }],
        shippingAddress: {

            country: {
                type: String,
                required: [true, 'Please provide country']
            },
            firstName: {
                type: String,
                required: [true, 'Please provide FirstName']
            },
            lastName: {
                type: String,
                required: [true, 'Please provide LastName']
            },
            address: {
                type: String,
                required: [true, 'Please provide address']
            },
            city: {
                type: String,
                required: [true, 'Please provide city']
            },
            postalCode: {
                type: Number,
                required: [true, 'Please provide postal code']
            },
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'received', 'returned'],
            default: 'pending',
        }
    },
    { timestamps: true }
)

export default mongoose.model('Order', OrderSchema);