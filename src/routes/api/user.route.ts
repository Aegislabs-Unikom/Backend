import { Router } from "express";
import { getAllUsers,getUserById,deleteUserById,register,login,logout} from "../../controllers/user.controller";
import { verifyUser } from "../../middleware/AuthUser";

const router = Router();


router.get("/",verifyUser,getAllUsers);
router.delete("/logout",logout)
router.post("/register",register);
router.post("/login",login);
router.delete("/:id",deleteUserById);
router.get("/:id",getUserById);





export default router;