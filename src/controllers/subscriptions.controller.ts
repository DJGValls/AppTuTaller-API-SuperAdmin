
import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { SubscriptionRepository } from "repositories/subscriptionRepositories";
import { SubscriptionService } from "services/subscriptionService";
import { InterfaceSubscriptionRepository, Subscription } from "../types/SubscriptionTypes";

const subscriptionRepository: InterfaceSubscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);

export const findSubscriptions = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const subscriptions = await subscriptionService.findSubscriptions(params.filter, params);
        const total = await subscriptionService.countSubscriptions(params.filter);
        if (subscriptions.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Suscripciones no encontradas", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(subscriptions, pagination, "Suscripciones encontradas exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(subscriptions, "Suscripciones encontradas exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar subscription:", error.message);
            res.status(500).json(ResponseHandler.error(error.message));
            return;
        } else if (error instanceof mongoose.Error) {
            // Error de formato de ID inválido
            res.status(500).json(ResponseHandler.handleMongooseError(error));
            return;
        } else {
            // Error desconocido
            console.error("Error desconocido:", error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    }
};

export const findSubscriptionById = async (req: Request, res: Response) => {
    try {
        const subscription = await subscriptionService.findSubscriptionById(req.params.id);
        if (!subscription) {
            res.status(404).json(ResponseHandler.notFound("Suscripcion no encontrada", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscription, "Suscripcion encontrada exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar subscription:", error.message);
            res.status(500).json(ResponseHandler.error(error.message));
            return;
        } else if (error instanceof mongoose.Error) {
            // Error de formato de ID inválido
            res.status(500).json(ResponseHandler.handleMongooseError(error));
            return;
        } else {
            // Error desconocido
            console.error("Error desconocido:", error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    }
};

export const createSubscription = async (req: Request, res: Response) => {
    try {
        const newSubscription: Subscription = req.body;
        const result = await subscriptionService.createSubscription(newSubscription);
        res.status(201).json(ResponseHandler.success(result, "Suscripcion creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear Suscripcion:", error.message);
            res.status(400).json(ResponseHandler.badRequest(error.message, 400));
            return;
        } else if (error instanceof mongoose.Error) {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        } else {
            console.error("Error desconocido:", error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    }
};

export const updateSubscription = async (req: Request, res: Response) => {
    try {
        const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
        if (!subscription) {
            res.status(404).json(ResponseHandler.notFound("Suscripcion no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscription, "Suscripcion actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar Suscripcion:", error.message);
            res.status(500).json(ResponseHandler.error(error.message));
            return;
        } else if (error instanceof mongoose.Error) {
            res.status(500).json(ResponseHandler.handleMongooseError(error));
            return;
        } else {
            console.error("Error desconocido:", error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    }
};

export const deleteSubscription = async (req: Request, res: Response) => {
    try {
        const subscription = await subscriptionService.deleteSubscription(req.params.id);
        if (!subscription) {
            res.status(404).json(ResponseHandler.notFound("Suscripcion no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscription, "Suscripcion eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar Suscripcion:", error.message);
            res.status(500).json(ResponseHandler.error(error.message));
            return;
        } else if (error instanceof mongoose.Error) {
            res.status(500).json(ResponseHandler.handleMongooseError(error));
            return;
        } else {
            console.error("Error desconocido:", error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    }
};
