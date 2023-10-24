import { User } from "../entity/User.entity";
import { Cart } from "../entity/Cart.entity";
import { Product } from "../entity/Product.entity";
import { Manager } from "../data-source";
import { ObjectId } from "mongodb";
import { errorRespone,respone } from "../utils/Response";

export const getAllCart = async (req: any, res: any) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const user = await Manager.findOneBy(User, { refresh_token: refresh_token });
  if (!user) return res.status(404).json(errorRespone("User not found"));

  if (req.role === "Admin") {
    const carts = await Manager.find(Cart);
    if (!carts) return res.status(404).json(errorRespone("Cart not found"));

    const userIdsInCarts = carts.map((cart) => cart.product_id);

    const productsWithQuantity = await Promise.all(
      userIdsInCarts.map(async (productId) => {
        const cart = carts.find((c) => c.product_id === productId);
        const product = await Manager.find(Product, { where: { _id: productId } });
        if (product) {
          // Buat objek baru yang mencakup Product dan quantity
          return {
            product: product[0],
            quantity: cart.quantity,
          };
        }
        return null;
      })
    );

    const filteredProducts = productsWithQuantity.filter((product) => product !== null);

    res.status(200).json(respone("[Admin] Success get all product in cart", filteredProducts));
  } else {
    const carts = await Manager.find(Cart, {
      where: {
        user_id: new ObjectId(user._id),
      },
    });
    if (!carts) return res.status(404).json(errorRespone("Cart not found"));
    const userIdsInCarts = carts.map((cart) => cart.product_id);

    const productsWithQuantity = await Promise.all(
      userIdsInCarts.map(async (productId) => {
        const cart = carts.find((c) => c.product_id === productId);
        const product = await Manager.find(Product, { where: { _id: productId } });
        if (product) {
          return {
            cart_id : cart._id,
            product: product[0],
            quantity: cart.quantity,
          };
        }
        return null;
      })
    );

    const filteredProducts = productsWithQuantity.filter((product) => product !== null);

    res.status(200).json(respone("[User] Success get all product in cart", filteredProducts));
  }
};

export const createCart = async (req: any, res: any) => {
  
  const {id} = req.params;
  const product = await Manager.findOneBy(Product,{_id : new ObjectId(id)});
  const user = await Manager.findOneBy(User,{refresh_token : req.cookies.refresh_token});
  if(!product) return res.status(404).json(errorRespone(`Product with id ${id} not found`))
  if(new ObjectId(user._id).equals(new ObjectId(product.user_id)) ) return res.status(400).json(errorRespone("You can't buy your product"));

  const quantity = parseInt(req.body.quantity);
  
  if(product.stock < quantity) return res.status(400).json(errorRespone("Stock is Empty"));

  product.stock -= quantity;


  
  try {
    const cart = new Cart({
      user_id : user._id,
      product_id : new ObjectId(product._id),
      quantity : quantity,
      amount : quantity * product.price,
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

export const deleteCartById = async (req: any, res: any) => {
  const {id} = req.params;
  try {
    const product = await Manager.delete(Cart, {_id : new ObjectId(id)});
    if(!product) return res.status(404).json(errorRespone(`Cart with id ${id} not found`));
    res.status(200).json(respone("Success delete cart",product))
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
}