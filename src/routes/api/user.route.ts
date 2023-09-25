import { Router } from "express";
import { getAllUsers,getUserById,deleteUserById,register,login} from "../../controllers/user.controller";

const router = Router();


router.get("/",getAllUsers);
router.get("/:id",getUserById);
router.delete("/:id",deleteUserById);
router.post("/register",register);
router.post("/login",login);



export default router;