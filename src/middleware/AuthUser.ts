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
  let session_user_id = req.session['user_id']
  if(!session_user_id){
    return res.status(401).json(errorRespone(`Login first to access this feature`))
  }
  const user = await Manager.findOneBy(User, { _id: new ObjectId(session_user_id) })
  if(!user) return res.status(401).json(errorRespone(`Login first to access this feature`))

  req.user_id = user._id;
  req.role = user.role;

  next()
}