import { Router } from "express";

const router = Router();

import user from "./api/user.route";
import otp from "./api/otp.route"
import product from "./api/product.route"

router.use("/api/user",user);
router.use("/api/otp",otp);
router.use("/api/products",product);

export default router;