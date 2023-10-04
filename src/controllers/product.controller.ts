import { Request,Response } from "express";
import { Manager } from "../data-source";
import { Product } from "../entity/Product.entity";
import { User } from "../entity/User.entity";
import { respone,errorRespone } from "../utils/Response";
import { ObjectId } from "mongodb";
import Joi from "joi";
import { join,resolve } from "path";
import fs from "fs";
import { Storage } from "@google-cloud/storage";
import storageService from "../utils/storageService";
import dotenv from "dotenv";
dotenv.config();

export const getAllProduct = async (req:Request,res:Response) => {
  const products = await Manager.find(Product, {
    select  : ["_id","nama_produk","description","price","stock","image","user_id"]
  })
  if(!products) return res.status(404).json(errorRespone("Products not found"))
  res.status(200).json(respone("Success get all products",products))
}

export const getAllProductByUser = async (req:Request,res:Response) => {
   const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const user = await Manager.findOneBy(User,{refresh_token : refresh_token});
  if(!user) return res.status(404).json(errorRespone("User not found"));
  try {
    if(req.role === "Admin"){
      const products = await Manager.find(Product, {
        select  : ["_id","nama_produk","description","price","stock","image","user_id"]
      })
      if(!products) return res.status(404).json(errorRespone("Products not found"))
      res.status(200).json(respone("[Admin] Success get all products",products))
    }else {
      const products = await Manager.find(Product,{
        where : {
          user_id : new ObjectId(user._id)
        },
        select : ["_id","nama_produk","description","price","stock","image","user_id"]
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

   const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const user = await Manager.findOneBy(User,{refresh_token : refresh_token});
  if(!user) return res.status(404).json(errorRespone("User not found"));
  
  if(req.role === "Admin"){
    const product = await Manager.findOneBy(Product,{_id : new ObjectId(id)});
    if(!product) return res.status(404).json(errorRespone(`Product with id ${id} not found`))
    res.status(200).json(respone("[Admin] Success get product",product))
  }else {
    const product = await Manager.findOneBy(Product,{
        _id : new ObjectId(id),
        user_id : new ObjectId(user._id)
    })
    if(!product) return res.status(404).json(errorRespone(`Product with id ${id} not found`))
    res.status(200).json(respone("[User] Success get product",product))
  }
}

export const createProduct = async(req:Request,res:Response) => {
  const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const singleUser = await Manager.findOneBy(User,{refresh_token : refresh_token});
  if(!singleUser) return res.status(404).json(errorRespone("User not found"));
  const file = req.file;
  

  if (!file) {
  console.log("No file uploaded");

}


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
    const user = await Manager.findOneBy(User,{_id : new ObjectId(singleUser._id)});
    const url = await storageService.store(file, "product/");

    try {
    const product = new Product({
      nama_produk : nama_produk,
      description : description,
      price : price,
      stock : stock,
      user_id : user._id,
      category_id : category_id,
      image: url,
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

  const schema = Joi.object({
    nama_produk: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if(error) return res.status(400).json(errorRespone(error.details[0].message));
 
  try {
    const product = await Manager.findOneBy(Product, { _id: new ObjectId(productId) });
    if (!product) return res.status(404).json(errorRespone(`Product with id ${productId} not found`));


    product.nama_produk = nama_produk;
    product.description = description;
    product.price = price;
    product.stock = stock;
  

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

    
const credentials = join(resolve(), "credentials.json");
const credentialsFile = fs.readFileSync(credentials);
const projectId = JSON.parse(credentialsFile.toString()).project_id;
const storage = new Storage({
  keyFilename: credentials,
  projectId: projectId,
});
   const bucket = storage.bucket("greenify_profile");

    var image_file= product.image;
    new Promise((resolve, reject) => {
    var imageurl = image_file.split("/");
    imageurl = imageurl.slice(4, imageurl.length + 1).join("/");


    storage
        .bucket(bucket.name)
        .file(imageurl)
        .delete()
        .then((image) => {
            resolve(image)
        })
        .catch((e) => {
            reject(e)
        });

});
  
  try {
    await Manager.delete(Product,{_id : new ObjectId(id)});
    res.status(200).json(respone("Success delete product",product));
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}