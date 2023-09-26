import { Router } from "express";

const router = Router();

import user from "./api/user.route";
import otp from "./api/otp.route"
import product from "./api/product.route"
import category from "./api/category.route"

router.use("/api/user",user);
router.use("/api/otp",otp);
router.use("/api/products",product);
router.use("/api/category",category)

export default router;