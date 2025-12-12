import { Router } from "express";
import { userQueryController } from "../controllers/llm-controller";

const router = Router();

router.route('/userQuery').post(userQueryController);
export default router;
