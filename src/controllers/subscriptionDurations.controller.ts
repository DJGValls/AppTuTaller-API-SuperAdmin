import { Request, Response } from "express";
import mongoose from "mongoose";
import { SubscriptionDurationRepository } from "repositories/subscriptionDurationRepositories";
import { subscriptionDurationCreateSchema } from "schemas/subscriptionsDurations/subscriptionDurationCreate.schema";
import { SubscriptionDurationService } from "services/subscriptionDurationService";
import { Params } from "types/RepositoryTypes";
import { InterfaceSubscriptionDurationRepository, SubscriptionDuration } from "types/SubscriptionsDurationTypes";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { ResponseHandler } from "utils/ResponseHandler";

const subscriptionDurationRepository: InterfaceSubscriptionDurationRepository = new SubscriptionDurationRepository();
const subscriptionDurationService = new SubscriptionDurationService(subscriptionDurationRepository);

export const findSubscriptionDurations = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const subscriptionDurations = await subscriptionDurationService.findSubscriptionDurations(params.filter, params);
        const total = await subscriptionDurationService.countSubscriptionDurations(params.filter);
        if (subscriptionDurations.length === 0) {
            res.status(404).json(ResponseHandler.notFound("SubscriptionDurationes no encontradas", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(subscriptionDurations, pagination, "SubscriptionDurationes encontradas exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(subscriptionDurations, "SubscriptionDurationes encontradas exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar subscriptionDuration:", error.message);
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

export const findSubscriptionDurationById = async (req: Request, res: Response) => {
    try {
        const subscriptionDuration = await subscriptionDurationService.findSubscriptionDurationById(req.params.id);
        if (!subscriptionDuration) {
            res.status(404).json(ResponseHandler.notFound("SubscriptionDuration no encontrada", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscriptionDuration, "SubscriptionDuration encontrada exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar subscriptionDuration:", error.message);
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

export const createSubscriptionDuration = async (req: Request, res: Response) => {
    try {
        const newSubscriptionDuration: SubscriptionDuration = req.body;
        const result = await subscriptionDurationService.createSubscriptionDuration(newSubscriptionDuration);
        res.status(201).json(ResponseHandler.success(result, "SubscriptionDuration creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear SubscriptionDuration:", error.message);
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

export const updateSubscriptionDuration = async (req: Request, res: Response) => {
    try {
        const subscriptionDuration = await subscriptionDurationService.updateSubscriptionDuration(req.params.id, req.body);
        if (!subscriptionDuration) {
            res.status(404).json(ResponseHandler.notFound("SubscriptionDuration no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscriptionDuration, "SubscriptionDuration actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar SubscriptionDuration:", error.message);
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

export const deleteSubscriptionDuration = async (req: Request, res: Response) => {
    try {
        const subscriptionDuration = await subscriptionDurationService.deleteSubscriptionDuration(req.params.id, req.currentUser?.id);
        if (!subscriptionDuration) {
            res.status(404).json(ResponseHandler.notFound("SubscriptionDuration no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscriptionDuration, "SubscriptionDuration eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar SubscriptionDuration:", error.message);
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

export const restoreSubscriptionDuration = async (req: Request, res: Response) => {
    try {
        const subscriptionDuration = await subscriptionDurationService.restoreSubscriptionDuration(req.params.id);
        if (!subscriptionDuration) {
            res.status(404).json(ResponseHandler.notFound("SubscriptionDuration no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(subscriptionDuration, "SubscriptionDuration restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar SubscriptionDuration:", error.message);
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
