import { Router } from "express";
import { verifyOTP,resendOTPVerification } from "../../controllers/otp.controller";

const router = Router();

router.post("/verify",verifyOTP);
router.post("/resend",resendOTPVerification);

export default router;