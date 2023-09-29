import { Router } from "express";
import { createCart,getAllCart } from "../../controllers/cart.controller";
import { verifyUser } from "../../middleware/AuthUser";
const router = Router();

router.get("/",verifyUser,getAllCart)
router.post("/:id",verifyUser,createCart)


export default router;