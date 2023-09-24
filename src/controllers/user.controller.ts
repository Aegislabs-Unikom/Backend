import express, {Request,Response,NextFunction} from "express";
import { Manager } from "../utils/Manager";
import { respone,errorRespone } from "../utils/Response";
import { User } from "../entity/User";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import Joi from "joi";


async function checkEmail(email: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await Manager.findOneBy(User, { email: email });
    if (user) return res.status(404).json(errorRespone(`Email ${email} already exist`));
    next();
  };
}

export const getAllUsers = async (req:Request,res:Response) => {
  try {
    const users = await Manager.find(User, {
        select : ["_id","email","nama","role","is_verified"]
       });
    if(!users) return res.status(404).json(errorRespone("Users not found"))
    res.status(200).json(respone("Success get all users",users));
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
  const { nama, email, password, confPassword, role } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    nama: Joi.string().required(),
    password: Joi.string().min(3).required(),
    confPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().required(),
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
      role: role,
      is_verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await Manager.save(User, user);
      res.status(201).json(respone('Success register', user));
    } catch (error) {
      if (error) return res.status(500).json(errorRespone(error.message));
    }
  });
};
