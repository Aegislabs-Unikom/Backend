import { User } from "../entity/User.entity";
import { Cart } from "../entity/Cart.entity";
import { Product } from "../entity/Product.entity";
import { Manager } from "../data-source";
import { ObjectId } from "mongodb";
import { errorRespone,respone } from "../utils/Response";

export const getAllCart = async (req: any, res: any) => {
  const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const user = await Manager.findOneBy(User,{refresh_token : refresh_token});
  if(!user) return res.status(404).json(errorRespone("User not found"));

  if(req.role === "Admin"){
    const carts = await Manager.find(Cart)
    if(!carts) return res.status(404).json(errorRespone("Cart not found"))

     const  userIdsInCarts = carts.map((cart)=> cart.product_id)

    const products = await Promise.all(
    userIdsInCarts.map(async (userId) => {
      const product = await Manager.find(Product, { where: { _id: userId } });
      return product;
      })
    );

    res.status(200).json(respone("[Admin] Success get all product in cart",products))
  }else {
    const carts = await Manager.find(Cart,{
      where : {
        user_id : new ObjectId(user._id)
      }
    })
    if(!carts) return res.status(404).json(errorRespone("Cart not found"))
    const  userIdsInCarts = carts.map((cart)=> cart.product_id)

    const products = await Promise.all(
    userIdsInCarts.map(async (userId) => {
      const product = await Manager.find(Product, { where: { _id: userId } });
      return product;
      })
    );

    res.status(200).json(respone("[User] Success get all product in cart",products))
  }
}

export const createCart = async (req: any, res: any) => {
  const {id} = req.params;
  const product = await Manager.findOneBy(Product,{_id : new ObjectId(id)});
  const quantity = parseInt(req.body.quantity);

  if(product.stock < quantity) return res.status(400).json(errorRespone("Stock is Empty"));

  product.stock -= quantity;
  const user = await Manager.findOneBy(User,{refresh_token : req.cookies.refresh_token});
  
  try {
    const cart = new Cart({
      user_id : user._id,
      product_id : new ObjectId(product._id),
      createdAt : new Date(),
      updatedAt : new Date()
    })
    await Manager.save(Cart,cart)
    await Manager.save(Product,product);
    res.status(200).json(respone("Success create cart",cart))
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }

}