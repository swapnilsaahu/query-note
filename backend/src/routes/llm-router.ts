import { Router } from "express";
import { userQueryController } from "../controllers/llm-controller";
import { jwtMiddleware } from "../middlewares/jwt-middleware";

const router = Router();

router.route('/userQuery').post(jwtMiddleware, userQueryController);
export default router;
