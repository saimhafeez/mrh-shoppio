import express from "express";
import dotenv from 'dotenv'
import connectDB from "./db/connect.js";
import 'express-async-errors' // passes the errors to the middleware without the use of next.

// routers
import authRoutes from './routers/authRoutes.js'
import vendorRoutes from './routers/vendorRoutes.js'
import siteRoutes from './routers/siteRoutes.js'
import customerRoutes from './routers/customerRoutes.js'

// Middlewares
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from './middleware/auth.js'
import Product from "./models/Product.js";
import User from "./models/User.js";
import ProductReview from "./models/ProductReview.js";
import mongoose from "mongoose";


// import Product from "./models/Product.js";
// const ProductEventEmitter = Product.watch()
// ProductEventEmitter.on('change', change => console.log('change in database', JSON.stringify(change)))


const app = express();
dotenv.config()

const port = process.env.PORT || 5000;


app.use(express.json())

app.get('/', (req, res) => {
  res.send("Hello from the Milkyway");
})

app.get('/api/v1', (req, res) => {
  res.send("API V1");
})


app.use('/api/v1/site', siteRoutes);
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/vendor', authenticateUser, vendorRoutes);
app.use('/api/v1/customer', authenticateUser, customerRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`server is listening on ${port}`);

      // await User.updateMany({}, { $set: { profileUrl: "" } })
      // console.log('update many')

      // const updateProductReviewDocuments = async () => {
      //   try {
      //     const reviews = await ProductReview.find({});

      //     for (const review of reviews) {
      //       review.productID = new mongoose.Types.ObjectId(review.productID);
      //       await review.save();
      //     }

      //     console.log("ProductReview documents updated successfully.");
      //   } catch (error) {
      //     console.error("Error updating ProductReview documents:", error);
      //   }
      // };

      // // Call the function to update the documents
      // updateProductReviewDocuments();

    })
  } catch (error) {
    console.log(error)
  }
}

start()