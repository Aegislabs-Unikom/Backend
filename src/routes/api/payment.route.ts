import { Router } from "express";
import {processPayment} from "../../controllers/payment.controller";
import { verifyUser,adminOnly } from "../../middleware/AuthUser";
const router = Router();

// router.post("/",processPayment);

export default router;