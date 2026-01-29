import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createCabin,
  getAllCabins,
  getCabinById,
  getCabinPrice,
  getBookedDatesByCabinId,
  updateCabin,
  deleteCabin,
} from "../controllers/cabins.controller.js";

const router = Router();

// Public routes (cabin info available to guests)
router.route("/").get(getAllCabins);
router.route("/:id").get(getCabinById);
router.route("/:id/price").get(getCabinPrice);
router.route("/:id/booked-dates").get(getBookedDatesByCabinId);

// Protected routes (admin only)
router.route("/").post(verifyJWT, upload.fields([{ name: "image", maxCount: 1 }]), createCabin);
router.route("/:id").patch(verifyJWT, upload.single("image"), updateCabin);
router.route("/:id").delete(verifyJWT, deleteCabin);

export default router;
