import { Router } from "express";
import { getAllProduct,getAllProductByUser,createProduct, updateProduct,deleteProduct } from "../../controllers/product.controller";
import { verifyUser } from "../../middleware/AuthUser";
import upload from "../../utils/Multer";
const router = Router();

router.get("/", verifyUser,getAllProduct);
router.get("/byuser",verifyUser,getAllProductByUser);
router.post("/",verifyUser,upload.single("image"),createProduct);
router.put("/:id",verifyUser,upload.single("image"),updateProduct);
router.delete("/:id",verifyUser,deleteProduct);

export default router;