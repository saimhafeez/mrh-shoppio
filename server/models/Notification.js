import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: [true, 'Provide user id']
        },
        title: {
            type: String,
            required: [true, 'Provide title']
        },
        message: {
            type: String,
            required: [true, 'Provide message']
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export default mongoose.model('Notification', NotificationSchema)