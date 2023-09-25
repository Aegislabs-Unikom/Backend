import dotenv from "dotenv";
import express from 'express';
import helmet from "helmet";
import cookieParser from 'cookie-parser'
import cors from "cors";
import routes from "../routes"
import session from 'express-session';
import http from "http";
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
app.use(routes);






export default server;

