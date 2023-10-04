import { Router } from "express";

const router = Router();

import user from "./api/user.route";
import otp from "./api/otp.route"
import product from "./api/product.route"
import category from "./api/category.route"
import cart from "./api/cart.route"
import order from "./api/order.route"

router.use("/api/user",user);
router.use("/api/otp",otp);
router.use("/api/products",product);
router.use("/api/category",category);
router.use("/api/cart",cart);
router.use("/api/order",order);

export default router;