import {Request,Response,NextFunction} from "express";
import { AppDataSource, Manager } from "../data-source";
import { respone,errorRespone } from "../utils/Response";
import { User } from "../entity/User.entity";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import Joi from "joi";
import { accessTokenSign,refreshTokenSign } from "../config/jwt";
import { sendOTPVerificationEmail } from "./otp.controller";
import { MongoEntityManager } from "typeorm";


async function checkEmail(email: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await Manager.findOneBy(User, { email: email });
    if (user) return res.status(404).json(errorRespone(`Email ${email} already exist`));
    next();
  };
}

export const getAllUsers = async (req:Request,res:Response) => {
  try {
    if(req.role === "Admin"){
      const users = await Manager.find(User, {
      select : ["_id","email","nama","role","is_verified"]
        });
      if(!users) return res.status(404).json(errorRespone("Users not found"))
      res.status(200).json(respone("Success get all users",users));
    } else {
      return res.status(401).json(errorRespone("You are not authorized to access this feature"))
    }
   
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}

export const getUserById = async (req:Request,res:Response) => {
  const { id } = req.params;
  try {
    const user = await Manager.findOneBy(User, {
      _id: new ObjectId(id)
    });
    if(!user) return res.status(404).json(errorRespone(`User with id ${id} not found`))
    res.status(200).json(respone("Success get user ",user));
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}

export const deleteUserById = async(req:Request,res:Response) => {
  const {id} = req.params

  try {
    const user = await Manager.findOneBy(User, {
      _id: new ObjectId(id)
    });
    if(!user) return res.status(404).json(errorRespone(`User with id ${id} not found`))

    await Manager.delete(User, {_id : new ObjectId(user._id)})
    res.status(200).json(respone(`Success delete user with id ${id}`,user))
    
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}

export const register = async (req: Request, res: Response) => {
  const { nama, email, password, confPassword} = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    nama: Joi.string().required(),
    password: Joi.string().min(3).required(),
    confPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(errorRespone(error.details[0].message));

  // Panggil middleware checkEmail
  await (await checkEmail(email))(req, res, async () => {

    // check match password
    if (confPassword !== password)
      return res.status(400).json(errorRespone('Password does not match'));

    const salt = await bcrypt.genSalt();
    const encryptPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email: email,
      nama: nama,
      password: encryptPassword,
      role: "user",
      is_verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await Manager.save(User, user);
        let data = {
                id: user._id,
                email: user.email,
                nama : user.nama,
                role : user.role
                };
                

      await sendOTPVerificationEmail(data,req,res);
    } catch (error) {
      if (error) return res.status(500).json(errorRespone(error.message));
    }
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(errorRespone(error.details[0].message));

  const user = await Manager.findOneBy(User,{email : email});

  if(!user) return res.status(404).json(errorRespone(`User with email ${email} not found`));
  if(user.is_verified === false ) return res.status(404).json(errorRespone(`User with email ${email} not verified`));

  const checkPassword = await bcrypt.compare(password, user.password)
  if(!checkPassword) return res.status(400).json({msg : "Password not match"})

  const payload = {user_id : user._id, email : user.email, nama: user.nama, role: user.role};
  const accessToken = accessTokenSign(payload, "30m");
  const refreshToken = refreshTokenSign(payload,"1d");

  try {
    await Manager.update(User, {_id : user._id}, {refresh_token : refreshToken})

    res.cookie("refresh_token", refreshToken, {
       httpOnly : true,
       maxAge : 24 * 60 * 60 * 1000,
       sameSite : "none",
       secure : true,
    })

    req.session["user_id"] = user._id

    const loginUser = {
      email : user.email,
      nama : user.nama,
      role : user.role,
      is_verified : user.is_verified
    }
  


    res.status(200).json(respone("Success login", { accessToken, user : loginUser }));
   
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}

export const logout = async(req: Request, res: Response) => {
  
  const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const user = await Manager.findOneBy(User,{refresh_token : refresh_token});

  try {
    await Manager.update(User, {_id : new ObjectId(user._id)}, {refresh_token : ""})
    res.clearCookie("refresh_token");
    req.session.destroy((err) => err ? console.error("Error destroying session:", err) : console.log("Session has been destroyed."));
    res.status(200).json(respone("Success logout",{}));
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }

}
