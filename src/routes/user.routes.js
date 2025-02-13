import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  changeCurrentUserPassword,
  getCurrentUSer,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccounddetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);

//securedRoutes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUSer);
router.route("/update-account").patch(verifyJWT, updateAccounddetails);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
