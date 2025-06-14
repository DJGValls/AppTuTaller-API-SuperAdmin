import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { CreditCardPayment, InterfaceCreditCardPaymentRepository } from "types/payments/CreditCardPaymentTypes";
import { CreditCardPaymentRepository } from "repositories/paymentRepositories/creditCardPaymentRepositories";
import { CreditCardPaymentService } from "services/payments/creditCardPaymentService";

const creditCardPaymentRepository: InterfaceCreditCardPaymentRepository = new CreditCardPaymentRepository();
const creditCardPaymentService = new CreditCardPaymentService(creditCardPaymentRepository);

export const findcreditCardPayments = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const creditCardPayments = await creditCardPaymentService.findCreditCardPayments(params.filter, params);
        const total = await creditCardPaymentService.countCreditCardPayments(params.filter);
        if (creditCardPayments.length === 0) {
            res.status(404).json(ResponseHandler.notFound("creditCardPaymentos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(creditCardPayments, pagination, "creditCardPaymentos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(creditCardPayments, "creditCardPaymentos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar creditCardPaymento:", error.message);
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

export const findcreditCardPaymentById = async (req: Request, res: Response) => {
    try {
        const creditCardPayment = await creditCardPaymentService.findCreditCardPaymentById(req.params.id);
        if (!creditCardPayment) {
            res.status(404).json(ResponseHandler.notFound("creditCardPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(creditCardPayment, "creditCardPaymento encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar creditCardPaymento:", error.message);
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

export const createcreditCardPayment = async (req: Request, res: Response) => {
    try {
        const newcreditCardPayment: CreditCardPayment = req.body;
        const result = await creditCardPaymentService.createCreditCardPayment(newcreditCardPayment);
        res.status(201).json(ResponseHandler.success(result, "creditCardPaymento creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear creditCardPaymento:", error.message);
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

export const updatecreditCardPayment = async (req: Request, res: Response) => {
    
    try {
        const creditCardPayment = await creditCardPaymentService.updateCreditCardPayment(req.params.id, req.body);
        if (!creditCardPayment) {
            res.status(404).json(ResponseHandler.notFound("creditCardPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(creditCardPayment, "creditCardPaymento actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar creditCardPaymento:", error.message);
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

export const deletecreditCardPayment = async (req: Request, res: Response) => {
    try {
        const creditCardPayment = await creditCardPaymentService.deleteCreditCardPayment(req.params.id, req.currentUser?.id);
        if (!creditCardPayment) {
            res.status(404).json(ResponseHandler.notFound("creditCardPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(creditCardPayment, "creditCardPaymento eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar creditCardPaymento:", error.message);
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

export const restorecreditCardPayment = async (req: Request, res: Response) => {
    try {
        const creditCardPayment = await creditCardPaymentService.restoreCreditCardPayment(req.params.id);
        if (!creditCardPayment) {
            res.status(404).json(ResponseHandler.notFound("creditCardPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(creditCardPayment, "creditCardPaymento restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar creditCardPaymento:", error.message);
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
