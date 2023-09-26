import { Router } from "express";
import { getAllCategory,deleteCategory,updateCategory,createCategory } from "../../controllers/category.controller";
import { verifyUser,adminOnly } from "../../middleware/AuthUser";
const router = Router();

router.get("/",verifyUser,getAllCategory);
router.delete("/:id",verifyUser,adminOnly,deleteCategory);
router.put("/:id",verifyUser,adminOnly,updateCategory);
router.post("/",verifyUser,adminOnly,createCategory);

export default router;