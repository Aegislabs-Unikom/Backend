import { AppDataSource } from "./data-source"
import dotenv from "dotenv";
import express from 'express';
import cookieParser from 'cookie-parser'
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json({}))
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 5000;


app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})


AppDataSource.initialize().then(async () => {


}).catch(error => console.log(error))
