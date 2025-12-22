import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt-middleware";
import { getNavBarNotes, getNotes } from "../controllers/note-controller";

const router = Router();

router.route("/getNotes/:tag").get(jwtMiddleware, getNotes);
router.route("/getNavs/").get(jwtMiddleware, getNavBarNotes);

export default router;
