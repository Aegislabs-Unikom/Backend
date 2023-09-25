import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export function accessTokenSign(payload:object, expiresIn: string | number){
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn
  })
}

export function refreshTokenSign(payload:object, expiresIn: string | number){
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn
  })
}