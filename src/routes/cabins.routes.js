import { Router } from "express";
import {
  getAllCabins,
  getCabinById,
  createCabin,
  updateCabin,
  deleteCabin,
  getCabinPrice,
  getBookedDatesByCabinId,
} from "../controllers/cabins.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCabinSchema,
  updateCabinSchema,
} from "../validators/common.validator.js";

const router = Router();

// Public routes
router.get("/", getAllCabins);
router.get("/:id", getCabinById);
router.get("/:id/price", getCabinPrice);
router.get("/:id/booked-dates", getBookedDatesByCabinId);

// Protected routes (Create, Update, Delete)
router.use(verifyJWT);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  validate(createCabinSchema),
  createCabin
);

router.patch(
  "/:id",
  upload.single("image"),
  validate(updateCabinSchema),
  updateCabin
);

router.delete("/:id", deleteCabin);

export default router;
