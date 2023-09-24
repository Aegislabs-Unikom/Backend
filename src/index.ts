import dotenv from "dotenv";
import express from 'express';
import cookieParser from 'cookie-parser'
import cors from "cors";


// ROUTER
import userRouter from "./routes/user.route";

dotenv.config();

const app = express();
app.use(express.json({}))
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 5000;

app.use("/api/user",userRouter)

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})


