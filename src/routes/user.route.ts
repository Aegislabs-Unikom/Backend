import express from "express";
import { getAllUsers,getUserById,deleteUserById,register} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/",getAllUsers);
userRouter.get("/:id",getUserById);
userRouter.delete("/:id",deleteUserById);
userRouter.post("/register",register);



export default userRouter;