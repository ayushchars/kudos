
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import routes from "./routes/index.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send(`<h1>Server is running on Port ${process.env.PORT}</h1>`);
});


app.listen(process.env.PORT,()=>{
    console.log("server is running fine ")
})