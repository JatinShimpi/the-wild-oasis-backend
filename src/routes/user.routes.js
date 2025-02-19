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

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser); //tested ok
router.route("/login").post(loginUser); // tested ok

//securedRoutes
router.route("/logout").post(verifyJWT, logoutUser); // tested ok
router.route("/refresh-token").post(refreshAccessToken); // tested ok
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword); //tested ok
router.route("/current-user").get(verifyJWT, getCurrentUSer); // tested ok
router.route("/update-account").patch(verifyJWT, updateAccounddetails); // tested ok

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar); //tested ok

export default router;
