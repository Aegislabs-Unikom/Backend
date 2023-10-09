import { Router } from "express";
import { createCart,getAllCart,deleteCartById } from "../../controllers/cart.controller";
import { verifyUser } from "../../middleware/AuthUser";
const router = Router();

router.get("/",verifyUser,getAllCart)
router.post("/:id",verifyUser,createCart)
router.delete("/:id",verifyUser,deleteCartById)


export default router;