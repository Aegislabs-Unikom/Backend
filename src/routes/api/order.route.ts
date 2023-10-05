import { Router } from "express";
import { checkout,getAllOrderByUser,deleteOrder } from "../../controllers/order.controller";
import { verifyUser,adminOnly } from "../../middleware/AuthUser";
const router = Router();

router.post("/",verifyUser,checkout);
router.get("/",verifyUser,getAllOrderByUser);
router.delete("/:id",verifyUser,adminOnly,deleteOrder);


export default router;