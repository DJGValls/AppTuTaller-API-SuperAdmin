import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { FreeDemoPayment, InterfaceFreeDemoPaymentRepository } from "types/payments/FreeDemoPaymentTypes";
import { FreeDemoPaymentRepository } from "repositories/paymentRepositories/freeDemoPaymentRepositories";
import { FreeDemoPaymentService } from "services/payments/freeDemoPaymentService";

const freeDemoPaymentRepository: InterfaceFreeDemoPaymentRepository = new FreeDemoPaymentRepository();
const freeDemoPaymentService = new FreeDemoPaymentService(freeDemoPaymentRepository);

export const findFreeDemoPayments = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const freeDemoPayments = await freeDemoPaymentService.findFreeDemoPayments(params.filter, params);
        const total = await freeDemoPaymentService.countFreeDemoPayments(params.filter);
        if (freeDemoPayments.length === 0) {
            res.status(404).json(ResponseHandler.notFound("freeDemoPaymentos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(freeDemoPayments, pagination, "freeDemoPaymentos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(freeDemoPayments, "freeDemoPaymentos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar freeDemoPaymento:", error.message);
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

export const findFreeDemoPaymentById = async (req: Request, res: Response) => {
    try {
        const freeDemoPayment = await freeDemoPaymentService.findFreeDemoPaymentById(req.params.id);
        if (!freeDemoPayment) {
            res.status(404).json(ResponseHandler.notFound("freeDemoPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(freeDemoPayment, "freeDemoPaymento encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar freeDemoPaymento:", error.message);
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

export const createFreeDemoPayment = async (req: Request, res: Response) => {
    try {
        const newfreeDemoPayment: FreeDemoPayment = req.body;
        const result = await freeDemoPaymentService.createFreeDemoPayment(newfreeDemoPayment);
        res.status(201).json(ResponseHandler.success(result, "freeDemoPaymento creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear freeDemoPaymento:", error.message);
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

export const updateFreeDemoPayment = async (req: Request, res: Response) => {
    
    try {
        const freeDemoPayment = await freeDemoPaymentService.updateFreeDemoPayment(req.params.id, req.body);
        if (!freeDemoPayment) {
            res.status(404).json(ResponseHandler.notFound("freeDemoPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(freeDemoPayment, "freeDemoPaymento actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar freeDemoPaymento:", error.message);
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

export const deleteFreeDemoPayment = async (req: Request, res: Response) => {
    try {
        const freeDemoPayment = await freeDemoPaymentService.deleteFreeDemoPayment(req.params.id, req.currentUser?.id);
        if (!freeDemoPayment) {
            res.status(404).json(ResponseHandler.notFound("freeDemoPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(freeDemoPayment, "freeDemoPaymento eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar freeDemoPaymento:", error.message);
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

export const restoreFreeDemoPayment = async (req: Request, res: Response) => {
    try {
        const freeDemoPayment = await freeDemoPaymentService.restoreFreeDemoPayment(req.params.id);
        if (!freeDemoPayment) {
            res.status(404).json(ResponseHandler.notFound("freeDemoPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(freeDemoPayment, "freeDemoPaymento restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar freeDemoPaymento:", error.message);
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
