import { Router } from "express";
import { loginUser, refreshTokens, registerUser, uploadNote, verifiedUser } from "../controllers/user-controller";
import { upload } from "../middlewares/multer-middleware";
import { jwtMiddleware } from "../middlewares/jwt-middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/uploadNote").post(jwtMiddleware, upload.array('image', 4), uploadNote);
router.route("/auth/refresh").post(refreshTokens);

export default router;
