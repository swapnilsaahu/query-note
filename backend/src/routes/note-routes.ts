import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt-middleware";
import { getNotes } from "../controllers/note-controller";

const router = Router();

router.route("/getNotes/:tag").get(jwtMiddleware, getNotes);

export default router;
