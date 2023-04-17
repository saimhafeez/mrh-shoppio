import express from "express";
import dotenv from 'dotenv'
import connectDB from "./db/connect.js";
import 'express-async-errors' // passes the errors to the middleware without the use of next.

// routers
import authRoutes from './routers/authRoutes.js'
import errorHandlerMiddleware from "./middleware/error-handler.js";

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


app.use('/api/v1/auth', authRoutes)


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