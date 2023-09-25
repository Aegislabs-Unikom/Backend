import { Router } from "express";

const router = Router();

import user from "./api/user.route";
import otp from "./api/otp.route"

router.use("/api/user",user);
router.use("/api/otp",otp);

export default router;