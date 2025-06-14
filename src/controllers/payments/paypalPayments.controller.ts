import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { InterfacePaypalPaymentRepository, PaypalPayment } from "types/payments/PaypalPaymentTypes";
import { PaypalPaymentRepository } from "repositories/paymentRepositories/paypalPaymentRepositories";
import { PaypalPaymentService } from "services/payments/paypalPaymentService";


const paypalPaymentRepository: InterfacePaypalPaymentRepository = new PaypalPaymentRepository();
const paypalPaymentService = new PaypalPaymentService(paypalPaymentRepository);

export const findPaypalPayments = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const paypalPayments = await paypalPaymentService.findPaypalPayments(params.filter, params);
        const total = await paypalPaymentService.countPaypalPayments(params.filter);
        if (paypalPayments.length === 0) {
            res.status(404).json(ResponseHandler.notFound("PaypalPaymentos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(paypalPayments, pagination, "PaypalPaymentos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(paypalPayments, "PaypalPaymentos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar PaypalPaymento:", error.message);
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

export const findPaypalPaymentById = async (req: Request, res: Response) => {
    try {
        const paypalPayment = await paypalPaymentService.findPaypalPaymentById(req.params.id);
        if (!paypalPayment) {
            res.status(404).json(ResponseHandler.notFound("PaypalPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paypalPayment, "PaypalPaymento encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar PaypalPaymento:", error.message);
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

export const createPaypalPayment = async (req: Request, res: Response) => {
    try {
        const newPaypalPayment: PaypalPayment = req.body;
        const result = await paypalPaymentService.createPaypalPayment(newPaypalPayment);
        res.status(201).json(ResponseHandler.success(result, "PaypalPaymento creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear PaypalPaymento:", error.message);
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

export const updatePaypalPayment = async (req: Request, res: Response) => {
    
    try {
        const paypalPayment = await paypalPaymentService.updatePaypalPayment(req.params.id, req.body);
        if (!paypalPayment) {
            res.status(404).json(ResponseHandler.notFound("PaypalPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paypalPayment, "PaypalPaymento actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar PaypalPaymento:", error.message);
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

export const deletePaypalPayment = async (req: Request, res: Response) => {
    try {
        const paypalPayment = await paypalPaymentService.deletePaypalPayment(req.params.id, req.currentUser?.id);
        if (!paypalPayment) {
            res.status(404).json(ResponseHandler.notFound("PaypalPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paypalPayment, "PaypalPaymento eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar PaypalPaymento:", error.message);
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

export const restorePaypalPayment = async (req: Request, res: Response) => {
    try {
        const paypalPayment = await paypalPaymentService.restorePaypalPayment(req.params.id);
        if (!paypalPayment) {
            res.status(404).json(ResponseHandler.notFound("PaypalPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(paypalPayment, "PaypalPaymento restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar PaypalPaymento:", error.message);
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
