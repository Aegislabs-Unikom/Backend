import { Request,Response } from "express";
import { Manager } from "../utils/Manager";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
import { respone,errorRespone } from "../utils/Response";
import { ObjectId } from "mongodb";
import Joi from "joi";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const getAllProduct = async (req:Request,res:Response) => {
  const products = await Manager.find(Product, {
    select  : ["_id","nama_produk","description","price","stock"]
  })
  if(!products) return res.status(404).json(errorRespone("Products not found"))
  res.status(200).json(respone("Success get all products",products))
}

export const getAllProductByUser = async (req:Request,res:Response) => {
  const session_user_id = req.session['user_id'];
  try {
    if(req.role === "Admin"){
      const products = await Manager.find(Product, {
        select  : ["_id","nama_produk","description","price","stock"]
      })
      if(!products) return res.status(404).json(errorRespone("Products not found"))
      res.status(200).json(respone("[Admin] Success get all products",products))
    }else {
      const products = await Manager.find(Product,{
        where : {
          user_id : new ObjectId(session_user_id)
        },
        select : ["_id","nama_produk","description","price","stock"]
      })
      if(!products) return res.status(404).json(errorRespone("Products not found"))
      res.status(200).json(respone("[User] Success get all products",products))
    }
    
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}

export const getSingleProduct = async (req:Request,res:Response) => {
  const {id} = req.params;
  const session_user_id = req.session['user_id'];
  if(req.role === "Admin"){
    const product = await Manager.findOneBy(Product,{_id : new ObjectId(id)});
    if(!product) return res.status(404).json(errorRespone(`Product with id ${id} not found`))
    res.status(200).json(respone("[Admin] Success get product",product))
  }else {
    const product = await Manager.findOneBy(Product,{
        _id : new ObjectId(id),
        user_id : new ObjectId(session_user_id)
    })
    if(!product) return res.status(404).json(errorRespone(`Product with id ${id} not found`))
    res.status(200).json(respone("[User] Success get product",product))
  }
}

export const createProduct = async(req:Request,res:Response) => {
  const session_user_id = req.session['user_id'];
  const file = req.file;

   const schema = Joi.object({
        nama_produk : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required(),
        stock : Joi.number().required(),
        category_id : Joi.string().required()
        
    })
    const {error} = schema.validate(req.body);


    if (error) {
    if (file) {
      fs.unlink(file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
      return res.status(400).json(errorRespone(error.details[0].message));
    }}
   
    
    
    const {nama_produk, description, category_id} = req.body;
    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock)
    const user = await Manager.findOneBy(User,{_id : new ObjectId(session_user_id)});

    try {
    const product = new Product({
      nama_produk : nama_produk,
      description : description,
      price : price,
      stock : stock,
      user_id : user._id,
      category_id : category_id,
      image: file.filename,
      createdAt : new Date(),
      updatedAt : new Date(),
    })
    await Manager.save(Product,product);
    res.status(200).json(respone("Success create product",product));
    } catch (error) {
      if(error) return res.status(500).json(errorRespone(error.message))
    }

}

export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const { nama_produk, description } = req.body;
  const price = parseFloat(req.body.price);
  const stock = parseInt(req.body.stock)
  const file = req.file;
  const newURL = file.filename;

  const schema = Joi.object({
    nama_produk: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    if (file) {
      fs.unlink(file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
      return res.status(400).json(errorRespone(error.details[0].message));
    }}
   
  try {
    const product = await Manager.findOneBy(Product, { _id: new ObjectId(productId) });
    if (!product) return res.status(404).json(errorRespone(`Product with id ${productId} not found`));

    if (product) {
        fs.unlinkSync(`./public/upload/${product.image}`)
      }

    product.nama_produk = nama_produk;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.image = newURL;

    await Manager.save(Product, product);

    res.status(200).json(respone("Success update product", product));
  } catch (error) {
    if (error) return res.status(500).json(errorRespone(error.message));
    
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await Manager.findOneBy(Product,{_id : new ObjectId(id)});
  if(!product) return res.status(404).json(errorRespone(`Product with id ${id} not found`))
  const pathDeleted = "./public/upload/" + product.image;

  try {
    await Manager.delete(Product,{_id : new ObjectId(id)});
     fs.unlink(pathDeleted, (err) => {
            if(err) throw err;
        })
    res.status(200).json(respone("Success delete product",product));
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}