
import { Router } from 'express';
import usersRoutes from "./users.routes.ts";
import rolesRoutes from "./roles.routes.ts";
import authRoutes from "./auth.routes.ts";
import subscriptionsRoutes from "./subscriptions.routes.ts";
import { verifyToken } from 'middlewares/auth.middleware.ts';
import subscriptionDurationsRoutes from "./subscriptionDurations.routes.ts";

const router = Router();

router.get("/health", (req, res, next) => {
  res.send("hello, All good in here")
});

// Auth routes
router.use("/auth", authRoutes);
// User routes
router.use("/users", verifyToken, usersRoutes);
// Roles routes
router.use("/roles", verifyToken, rolesRoutes);
// Subscriptions routes
router.use("/subscriptions", verifyToken, subscriptionsRoutes);

export default router;