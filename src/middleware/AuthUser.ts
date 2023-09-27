import { Request,Response,NextFunction } from "express";
import { Manager } from "../utils/Manager";
import { User } from "../entity/User";
import { ObjectId } from "mongodb";
import { errorRespone } from "../utils/Response";

declare module 'express' {
  interface Request {
    user_id: ObjectId 
    role : string
  }
}

export const verifyUser = async(req:Request,res:Response,next:NextFunction) => {
   const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(401).json(errorRespone("Login first to access this feature"));
  const users = await Manager.findOneBy(User,{refresh_token : refresh_token});
  const user = await Manager.findOneBy(User, { _id: new ObjectId(users._id) })
  if(!user) return res.status(401).json(errorRespone(`Login first to access this feature`))

  req.user_id = user._id;
  req.role = user.role;

  next()
}

export const adminOnly = async(req:Request,res:Response,next:NextFunction) => {
   const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(401).json(errorRespone("Admin Only "));
  const users = await Manager.findOneBy(User,{refresh_token : refresh_token});

  const user = await Manager.findOneBy(User,{_id : new ObjectId(users._id)})
  if(!user) return res.status(401).json(errorRespone(`Login first to access this feature`))
  if(user.role !== "Admin") return res.status(401).json(errorRespone(`You are not authorized to access this feature`))
  next();
}