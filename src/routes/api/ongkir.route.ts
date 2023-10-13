import { Router } from "express";
import { getProvinsi,getKota,getOngkir } from "../../controllers/ongkir.controller";
const router = Router();

router.get("/provinsi",getProvinsi);
router.get("/kota/:id",getKota);
router.get("/ongkir/:asal/:tujuan/:berat/:kurir",getOngkir);



export default router;