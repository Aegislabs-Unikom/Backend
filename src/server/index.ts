import dotenv from "dotenv";
import express from 'express';
import helmet from "helmet";
import cookieParser from 'cookie-parser'
import cors from "cors";
import routes from "../routes"
import session from 'express-session';
import http from "http";
import { AppDataSource } from "../data-source";
import path = require("path");
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Access-Token', 'X-Key', 'Cookies', 'Cache-Control', 'Set-Cookie', ],
  credentials: true
}));


app.use(session({
  secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767', 
  resave: false,
  saveUninitialized: false,
  proxy : true
}));

app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/image', express.static(path.join(__dirname, "../../public/upload")));

AppDataSource.initialize()
  .then(async () => {
    app.use(routes);
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));












export default server;

