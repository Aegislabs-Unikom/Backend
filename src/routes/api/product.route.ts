import { Router } from "express";
import { getAllProduct,getAllProductByUser, getSingleProduct,createProduct, updateProduct,deleteProduct } from "../../controllers/product.controller";
import { verifyUser } from "../../middleware/AuthUser";
import multerUploads from "../../utils/Multer";
const router = Router();

router.get("/", getAllProduct);
router.get("/byuser",verifyUser,getAllProductByUser);
router.post("/",verifyUser,multerUploads.single("images"),createProduct);
router.get("/:id",verifyUser,getSingleProduct);
router.put("/:id",verifyUser,multerUploads.single("images"),updateProduct);
router.delete("/:id",verifyUser,deleteProduct);

export default router;