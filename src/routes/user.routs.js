import { Router } from "express";
import {
  logoutUser,
  registerUser,
  currentpasswordChange,
  getCurrentUser,

} from "../controller/user.controller.js";
import { loginUser } from "../controller/user.controller.js";
import { body } from "express-validator";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.route("/register").post(
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("aadhar").isLength({max:12})
  ],
  registerUser
);

// login routes
router.route("/login").post(loginUser);

// logout routes routes
router.route("/logout").post(verifyJWT, logoutUser);

// generating refresh tokens

// updating password
router.route("/changepassword").post(currentpasswordChange);

// get user details 
router.route("/getuser").get(verifyJWT, getCurrentUser);

export default router;
