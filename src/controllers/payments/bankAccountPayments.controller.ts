import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { BankAccountPayment, InterfaceBankAccountPaymentRepository } from "types/payments/BankAccountPaymentTypes";
import { BankAccountPaymentRepository } from "repositories/paymentRepositories/bankAccountPaymentRepositories";
import { BankAccountPaymentService } from "services/payments/bankAccountPaymentService";

const bankAccountPaymentRepository: InterfaceBankAccountPaymentRepository = new BankAccountPaymentRepository();
const bankAccountPaymentService = new BankAccountPaymentService(bankAccountPaymentRepository);

export const findBankAccountPayments = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const bankAccountPayments = await bankAccountPaymentService.findBankAccountPayments(params.filter, params);
        const total = await bankAccountPaymentService.countBankAccountPayments(params.filter);
        if (bankAccountPayments.length === 0) {
            res.status(404).json(ResponseHandler.notFound("BankAccountPaymentos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(bankAccountPayments, pagination, "BankAccountPaymentos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(bankAccountPayments, "BankAccountPaymentos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar BankAccountPaymento:", error.message);
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

export const findBankAccountPaymentById = async (req: Request, res: Response) => {
    try {
        const bankAccountPayment = await bankAccountPaymentService.findBankAccountPaymentById(req.params.id);
        if (!bankAccountPayment) {
            res.status(404).json(ResponseHandler.notFound("BankAccountPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(bankAccountPayment, "BankAccountPaymento encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar BankAccountPaymento:", error.message);
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

export const createBankAccountPayment = async (req: Request, res: Response) => {
    try {
        const newBankAccountPayment: BankAccountPayment = req.body;
        const result = await bankAccountPaymentService.createBankAccountPayment(newBankAccountPayment);
        res.status(201).json(ResponseHandler.success(result, "BankAccountPaymento creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear BankAccountPaymento:", error.message);
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

export const updateBankAccountPayment = async (req: Request, res: Response) => {
    
    try {
        const bankAccountPayment = await bankAccountPaymentService.updateBankAccountPayment(req.params.id, req.body);
        if (!bankAccountPayment) {
            res.status(404).json(ResponseHandler.notFound("BankAccountPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(bankAccountPayment, "BankAccountPaymento actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar BankAccountPaymento:", error.message);
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

export const deleteBankAccountPayment = async (req: Request, res: Response) => {
    try {
        const bankAccountPayment = await bankAccountPaymentService.deleteBankAccountPayment(req.params.id, req.currentUser?.id);
        if (!bankAccountPayment) {
            res.status(404).json(ResponseHandler.notFound("BankAccountPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(bankAccountPayment, "BankAccountPaymento eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar BankAccountPaymento:", error.message);
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

export const restoreBankAccountPayment = async (req: Request, res: Response) => {
    try {
        const bankAccountPayment = await bankAccountPaymentService.restoreBankAccountPayment(req.params.id);
        if (!bankAccountPayment) {
            res.status(404).json(ResponseHandler.notFound("BankAccountPaymento no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(bankAccountPayment, "BankAccountPaymento restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar BankAccountPaymento:", error.message);
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
