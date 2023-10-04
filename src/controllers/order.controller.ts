import {Request,Response } from "express";
import { Order } from "../entity/Order.entity";
import { Product } from "../entity/Product.entity";
import { Cart } from "../entity/Cart.entity";
import { Category } from "../entity/Category.entity";
import { User } from "../entity/User.entity";
import { ObjectId } from "mongodb";
import { Manager } from "../data-source";
import { respone,errorRespone } from "../utils/Response";

export const checkout = async (req: Request, res: Response) => {
  try {
    const user = await Manager.findOneBy(User, { refresh_token: req.cookies.refresh_token });
    if (!user) {
      return res.status(401).json({ message: 'Login first, cookies not found' });
    }
    const cartItems = await Manager.find(Cart, {
      where: {
        user_id: new ObjectId(user._id),
      },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: `Cart from user: ${user.nama} is empty` });
    }

    let totalAmount = 0;
    const products: any[] = [];

    for (const cartItem of cartItems) {
      const product = await Manager.findOneBy(Product, { _id: cartItem.product_id });
      const category = await Manager.findOneBy(Category, { _id: new ObjectId(product.category_id ) });
      if (product) {
        const subtotal = product.price * cartItem.quantity;
        totalAmount += subtotal;
        const productFragment = {
          nama : product.nama_produk,
          description : product.description,
          price : product.price,
          stock : product.stock,
          image : product.image,
          category : category.nama_category,
        }
        products.push(productFragment);
      }
    }


    const order = new Order({
      products: products,
      status: 'pending',
      total_amount: totalAmount, 
      user_id: new ObjectId(user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    for(const cartItem of cartItems){
      await Manager.delete(Cart, {_id: cartItem._id});
    }

   
    await Manager.save(order);

    return res.status(200).json(respone('Success checkout', order));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorRespone(error.message));
  }
};

export const getAllOrderByUser = async (req: Request, res: Response) => {
  const user = await Manager.findOneBy(User, { refresh_token: req.cookies.refresh_token });
   if (!user) {
      return res.status(401).json({ message: 'Login first, cookies not found' });
    }
  if(req.role === "Admin") {
    const orders = await Manager.find(Order);
    if(!orders) return res.status(404).json(errorRespone("Orders not found"))
    return res.status(200).json(respone("[Admin] Success get all orders", orders));
  } else {
    const orders = await Manager.find(Order, {
      where: {
        user_id: new ObjectId(user._id),
      },
    });
    return res.status(200).json(respone("[User] Success get all orders", orders));
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  const {id} = req.params;
  const order = await Manager.delete(Order, {_id : new ObjectId(id)});
  return res.status(200).json(respone("Success delete order",order));
}