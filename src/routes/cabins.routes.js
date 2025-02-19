import {Router} from "express"
import {
  createCabin,
  getAllCabins,
  getCabinById,
  updateCabin,
  deleteCabin,
} from "../controllers/cabins.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-cabin").post(verifyJWT,createCabin) // Create a new cabin
router.route("/get-all-cabins").get(verifyJWT,getAllCabins); // Get all cabins

router.route("/:id").get(verifyJWT,getCabinById) // Get a specific cabin
router.route("/:id").put(verifyJWT,updateCabin) // Update a cabin
router.route("/:id").delete(verifyJWT,deleteCabin); // Delete a cabin

export default router;
