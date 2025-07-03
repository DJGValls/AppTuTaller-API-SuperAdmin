import { Router } from "express";
import usersRoutes from "./users.routes";
import rolesRoutes from "./roles.routes";
import authRoutes from "./auth.routes";
import subscriptionsRoutes from "./subscriptions.routes";
import wokshopsRoutes from "./wokshops.routes";
import contactsRoutes from "./contacts.routes";
import reparationOrdersRoutes from "./reparationOrders.routes";
import reparationTasksRoutes from "./reparationTasks.routes";
import appointmentsRoutes from "./appointments.routes";
import workshopSchedulesRoutes from "./workshopSchedules.routes";
import { verifyToken } from "middlewares/auth.middleware";

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
// Appointments routes
router.use("/appointments", verifyToken, appointmentsRoutes);
// Workshop Schedules routes
router.use("/workshop-schedules", verifyToken, workshopSchedulesRoutes);

export default router;
