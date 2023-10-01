import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { OTP } from "../entity/OTP.entity";
import { User } from "../entity/User.entity";
import { Manager } from "../data-source";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { respone,errorRespone } from "../utils/Response";
import { refreshTokenSign } from "../config/jwt";

import env from "dotenv";
env.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.USER_EMAIL, pass: process.env.USER_PASSWORD },
});

export const sendOTPVerificationEmail = async ({ id, email,nama,role }, req: any, res: any) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 90000)}`;

    // Email option
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `<p>Enter <b>${otp}</b> to verify your gmail registration </p><p>This code <b>expires in 1 Hours</b></p>`,
    };

    // Hash OTP
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    await Manager.save(OTP, {
      otp : hashedOTP,
      user_id: id,
      expiresAt: new Date(Date.now() + 3600000),
      createdAt : new Date(),
      updatedAt : new Date()
    })


    await transporter.sendMail(mailOptions); 
    res.status(200).json(respone("Verification code has been sent please check your email",{
        user_id: id,
        email,
    }));
    
    
   
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token;
  if(!refresh_token) return res.status(400).json(errorRespone("Refresh token not found"));
  const user = await Manager.findOneBy(User,{refresh_token : refresh_token});
  if(!user) return res.status(404).json(errorRespone("User not found"));

  const user_id = user._id;

  const { otp } = req.body;

  try {
    if (!user_id || !otp) {
      throw new Error("Empty OTP is not allowed");
    } else {
      const user = await Manager.findOneBy(User, { _id: new ObjectId(user_id) });

      if (!user) {
        return res.status(404).json(errorRespone(`User with id ${user_id} not found`));
      }

      const otpToken = await Manager.findOneBy(OTP, { user_id: new ObjectId(user._id) });

      if (!otpToken) {
        throw new Error("User doesn't have an OTP token");
      }

      const expiresAt = otpToken.expiresAt;
      const hashedOTP = otpToken.otp;

      if (expiresAt < new Date()) {
        await Manager.delete(OTP, { user_id: new ObjectId(user_id) });
        throw new Error("The code has expired, please request a new one");
      }

      const validOTP = await bcrypt.compare(otp, hashedOTP);

      if (!validOTP) {
        return res.status(400).json({ msg: "OTP is wrong" });
      }

      user.is_verified = true;
      await Manager.save(User, user);
      
      res.clearCookie("refresh_token");
      req.session.destroy((err) => err ? console.error("Error destroying session:", err) : console.log("Session has been destroyed."));
      await Manager.update(User, {_id : new ObjectId(user._id)}, {refresh_token : ""})
      
      await Manager.delete(OTP, { user_id: new ObjectId(user_id) });

      res.status(200).json(respone("User has been verified", user));

    }
  } catch (error) {
    if(error) return res.status(500).json(errorRespone(error.message))
  }
};

export const resendOTPVerification = async (req: Request, res: Response) => {
  const {email} = req.body;
  const user_id = await Manager.findOneBy(User, { email: email });
  try {
    if(!user_id || !email) {
      throw new Error("Empty email is not allowed");
    }

    await Manager.delete(OTP, { user_id: new ObjectId(user_id._id) });
    await sendOTPVerificationEmail({ id: user_id._id, email, nama: user_id.nama, role: user_id.role }, req, res);
  } catch (error) {
    res.json({
      status : "FAILED",
      msg : error.message
    })
  }

}