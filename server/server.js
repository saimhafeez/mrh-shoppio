import express from "express";
import dotenv from 'dotenv'
import connectDB from "./db/connect.js";
import 'express-async-errors' // passes the errors to the middleware without the use of next.

// routers
import authRoutes from './routers/authRoutes.js'
import vendorRoutes from './routers/vendorRoutes.js'
import siteRoutes from './routers/siteRoutes.js'

// Middlewares
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from './middleware/auth.js'


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
// app.use('/api/v1/vendor', vendorRoutes);


app.use(errorHandlerMiddleware)


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`server is listening on ${port}`);
    })
  } catch (error) {
    console.log(error)
  }
}

start()