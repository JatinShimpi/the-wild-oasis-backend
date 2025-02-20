import { Router } from "express";
import {
  createCabin,
  getAllCabins,
  getCabinById,
  updateCabin,
  deleteCabin,
} from "../controllers/cabins.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/create-cabin")
  .post(
    verifyJWT,
    upload.fields([{ name: "cabinImage", maxCount: 1 }]),
    createCabin,
  ); // Create a new cabin // tested ok

router.route("/get-all-cabins").get(verifyJWT, getAllCabins); // Get all cabins // tested ok

router.route("/:id").get(verifyJWT, getCabinById); // Get a specific cabin // tested ok
router.route("/:id").patch(verifyJWT, upload.single("cabinImage"), updateCabin); // Update a cabin //tested ok
router.route("/:id").delete(verifyJWT, deleteCabin); // Delete a cabin // tested ok

export default router;
