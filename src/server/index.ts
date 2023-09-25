import dotenv from "dotenv";
import express from 'express';
import helmet from "helmet";
import cookieParser from 'cookie-parser'
import cors from "cors";
import routes from "../routes"
import session from 'express-session';
import http from "http";
import { AppDataSource } from "../data-source";
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

AppDataSource.initialize().then(async () => {
  app.use(routes);
}).catch(error => console.log(error))





export default server;

