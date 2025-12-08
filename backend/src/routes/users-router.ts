import { Router } from "express";
import { loginUser, registerUser, uploadNote } from "../controllers/user-controller";
import { upload } from "../middlewares/multer-middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/uploadNote").post(upload.single('image'), uploadNote);

export default router;
