import express from "express";

const app = express();

app.use('/', (req, res)=>{
  res.send("Hello from the Milkyway");
})

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server is listening on port ${port}`));

