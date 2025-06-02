import { loginUser, registerUser } from "controllers/auth/auth.controller";
import { validate } from "middlewares/validate.middleware";
import { loginSchema, registerSchema } from "schemas/auth.schema";
import { Router } from "express";
import { checkRoles } from "middlewares/roles.middleware";

const router = Router();

router.post('/register',validate(registerSchema),checkRoles ,registerUser);
router.post('/login',validate(loginSchema) , loginUser);

export default router;
