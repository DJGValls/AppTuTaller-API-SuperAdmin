import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { InterfaceStripePaymentRepository, StripePayment } from "types/payments/StripePaymentTypes";
import { StripePaymentRepository } from "repositories/paymentRepositories/stripePaymentRepositories";
import { StripePaymentService } from "services/payments/stripePaymentService";

const stripePaymentRepository: InterfaceStripePaymentRepository = new StripePaymentRepository();
const stripePaymentService = new StripePaymentService(stripePaymentRepository);

export const findStripePayments = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const stripePayments = await stripePaymentService.findStripePayments(params.filter, params);
        const total = await stripePaymentService.countStripePayments(params.filter);
        if (stripePayments.length === 0) {
            res.status(404).json(ResponseHandler.notFound("stripePaymentos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(stripePayments, pagination, "stripePaymentos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(stripePayments, "stripePaymentos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar stripePaymento:", error.message);
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

export const findStripePaymentById = async (req: Request, res: Response) => {
    try {
        const stripePayment = await stripePaymentService.findStripePaymentById(req.params.id);
        if (!stripePayment) {
            res.status(404).json(ResponseHandler.notFound("stripePaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(stripePayment, "stripePaymento encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar stripePaymento:", error.message);
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

export const createStripePayment = async (req: Request, res: Response) => {
    try {
        const newstripePayment: StripePayment = req.body;
        const result = await stripePaymentService.createStripePayment(newstripePayment);
        res.status(201).json(ResponseHandler.success(result, "stripePaymento creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear stripePaymento:", error.message);
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

export const updateStripePayment = async (req: Request, res: Response) => {
    
    try {
        const stripePayment = await stripePaymentService.updateStripePayment(req.params.id, req.body);
        if (!stripePayment) {
            res.status(404).json(ResponseHandler.notFound("stripePaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(stripePayment, "stripePaymento actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar stripePaymento:", error.message);
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

export const deleteStripePayment = async (req: Request, res: Response) => {
    try {
        const stripePayment = await stripePaymentService.deleteStripePayment(req.params.id, req.currentUser?.id);
        if (!stripePayment) {
            res.status(404).json(ResponseHandler.notFound("stripePaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(stripePayment, "stripePaymento eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar stripePaymento:", error.message);
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

export const restoreStripePayment = async (req: Request, res: Response) => {
    try {
        const stripePayment = await stripePaymentService.restoreStripePayment(req.params.id);
        if (!stripePayment) {
            res.status(404).json(ResponseHandler.notFound("stripePaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(stripePayment, "stripePaymento restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar stripePaymento:", error.message);
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
