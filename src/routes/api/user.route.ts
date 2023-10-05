import { Router } from "express";
import { getAllUsers,getUserById,deleteUserById,register,login,logout,addAlamat} from "../../controllers/user.controller";
import { verifyUser,adminOnly } from "../../middleware/AuthUser";

const router = Router();


router.get("/",verifyUser,getAllUsers);
router.delete("/logout",verifyUser,logout)
router.post("/register",register);
router.post("/login",login);
router.delete("/:id",verifyUser,adminOnly,deleteUserById);
router.get("/:id",verifyUser,getUserById);
router.post("/alamat",verifyUser,addAlamat);





export default router;