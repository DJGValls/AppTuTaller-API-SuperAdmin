import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { InterfacePaymentMethodRepository, PaymentMethod } from "types/payments/PaymentMethodTypes";
import { PaymentMethodRepository } from "repositories/paymentRepositories/paymentMethodRepositories";
import { PaymentMethodService } from "services/payments/paymentMethodService";

const paymentMethodRepository: InterfacePaymentMethodRepository = new PaymentMethodRepository();
const paymentMethodService = new PaymentMethodService(paymentMethodRepository);

export const findPaymentMethods = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const paymentMethods = await paymentMethodService.findPaymentMethods(params.filter, params);
        const total = await paymentMethodService.countPaymentMethods(params.filter);
        if (paymentMethods.length === 0) {
            res.status(404).json(ResponseHandler.notFound("PaymentMethodos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(paymentMethods, pagination, "PaymentMethodos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(paymentMethods, "PaymentMethodos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar PaymentMethodo:", error.message);
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

export const findPaymentMethodById = async (req: Request, res: Response) => {
    try {
        const paymentMethod = await paymentMethodService.findPaymentMethodById(req.params.id);
        if (!paymentMethod) {
            res.status(404).json(ResponseHandler.notFound("PaymentMethodo no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paymentMethod, "PaymentMethodo encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar PaymentMethodo:", error.message);
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

export const createPaymentMethod = async (req: Request, res: Response) => {
    try {
        const newPaymentMethod: PaymentMethod = req.body;
        const result = await paymentMethodService.createPaymentMethod(newPaymentMethod);
        res.status(201).json(ResponseHandler.success(result, "PaymentMethodo creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear PaymentMethodo:", error.message);
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

export const updatePaymentMethod = async (req: Request, res: Response) => {
    
    try {
        const paymentMethod = await paymentMethodService.updatePaymentMethod(req.params.id, req.body);
        if (!paymentMethod) {
            res.status(404).json(ResponseHandler.notFound("PaymentMethodo no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paymentMethod, "PaymentMethodo actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar PaymentMethodo:", error.message);
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

export const deletePaymentMethod = async (req: Request, res: Response) => {
    try {
        const paymentMethod = await paymentMethodService.deletePaymentMethod(req.params.id, req.currentUser?.id);
        if (!paymentMethod) {
            res.status(404).json(ResponseHandler.notFound("PaymentMethodo no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paymentMethod, "PaymentMethodo eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar PaymentMethodo:", error.message);
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

export const restorePaymentMethod = async (req: Request, res: Response) => {
    try {
        const paymentMethod = await paymentMethodService.restorePaymentMethod(req.params.id);
        if (!paymentMethod) {
            res.status(404).json(ResponseHandler.notFound("PaymentMethodo no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paymentMethod, "PaymentMethodo restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar PaymentMethodo:", error.message);
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
