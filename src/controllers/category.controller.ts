import { Response,Request } from "express";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import { Category } from "../entity/Category.entity";
import { respone,errorRespone } from "../utils/Response";


export const getAllCategory = async (req:Request,res:Response) => {
  const category = await Manager.find(Category);
  if(!category) return res.status(404).json(errorRespone("Category not found"))
  res.status(200).json(respone("Success get all category",category))
}

export const createCategory = async (req:Request,res:Response) => {
  const {nama_category}  = req.body;
  const category = new Category({
    nama_category : nama_category,
    createdAt : new Date(),
    updatedAt : new Date()
  })
  await Manager.save(Category,category)
  res.status(200).json(respone("Success create category",category))
}

export const updateCategory = async (req:Request,res:Response) => {
  const {id} = req.params;
  const category = await Manager.findOneBy(Category,{_id : new ObjectId(id)});
  if(!category) return res.status(404).json(errorRespone(`Category with id ${id} not found`))
  const updatedCategory = await Manager.update(Category,{_id : new ObjectId(id)},req.body);
  res.status(200).json(respone("Success update category",updatedCategory))
}

export const deleteCategory = async (req:Request,res:Response) => {
  const {id} = req.params;
  const category = await Manager.findOneBy(Category,{_id : new ObjectId(id)});
  if(!category) return res.status(404).json(errorRespone(`Category with id ${id} not found`))
  const deletedCategory = await Manager.delete(Category,{_id : new ObjectId(id)});
  res.status(200).json(respone("Success delete category",deletedCategory))
}