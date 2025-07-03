import { Router } from "express";
import usersRoutes from "./users.routes.ts";
import rolesRoutes from "./roles.routes.ts";
import authRoutes from "./auth.routes.ts";
import subscriptionsRoutes from "./subscriptions.routes.ts";
import wokshopsRoutes from "./wokshops.routes.ts";
import contactsRoutes from "./contacts.routes.ts";
import reparationOrdersRoutes from "./reparationOrders.routes.ts";
import reparationTasksRoutes from "./reparationTasks.routes.ts";
import { verifyToken } from "middlewares/auth.middleware.ts";

const router = Router();

router.get("/health", (req, res, next) => {
    res.send("hello, All good in here");
});

// Auth routes
router.use("/auth", authRoutes);
// User routes
router.use("/users", verifyToken, usersRoutes);
// Roles routes
router.use("/roles", verifyToken, rolesRoutes);
// Subscriptions routes
router.use("/subscriptions", verifyToken, subscriptionsRoutes);
// Workshops routes
router.use("/wokshops", verifyToken, wokshopsRoutes);
// Contacts routes
router.use("/contacts", verifyToken, contactsRoutes);
// ReparationOrders routes
router.use("/reparationOrders", verifyToken, reparationOrdersRoutes);
// ReparationTasks routes
router.use("/reparationTasks", verifyToken, reparationTasksRoutes);

export default router;
