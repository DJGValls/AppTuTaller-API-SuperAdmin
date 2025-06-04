import { createSubscription, deleteSubscription, findSubscriptionById, findSubscriptions, updateSubscription } from "controllers/subscriptions.controller";
import { Router } from "express";
import { getPermissions } from "middlewares/auth.middleware";
import { checkRoles } from "middlewares/roles.middleware";
import { validate } from "middlewares/validate.middleware";
import { subscriptionSchema } from "schemas/subscription.schema";

const router = Router();

router.get('/', getPermissions, findSubscriptions);

router.get('/:id', getPermissions, findSubscriptionById);

router.post('/', validate(subscriptionSchema), getPermissions, checkRoles, createSubscription);

router.put('/:id', getPermissions, updateSubscription);

router.delete('/:id', getPermissions, deleteSubscription);

export default router;