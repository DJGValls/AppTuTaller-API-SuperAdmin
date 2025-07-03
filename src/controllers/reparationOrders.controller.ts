import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { InterfaceReparationOrderRepository, ReparationOrder } from "types/ReparationOrderTypes";
import { ReparationOrderRepository } from "repositories/reparationOrderRepositories";
import { ReparationOrderService } from "services/reparationOrderService";
import { InterfaceWorkshopRepository } from "types/WorkshopTypes";
import { WorkshopRepository } from "repositories/workshopRepositories";
import { WorkshopService } from "services/workshopService";

const reparationOrderRepository: InterfaceReparationOrderRepository = new ReparationOrderRepository();
const reparationOrderService = new ReparationOrderService(reparationOrderRepository);
const workshopRepository: InterfaceWorkshopRepository = new WorkshopRepository();
const workshopService = new WorkshopService(workshopRepository);

export const findReparationOrders = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const reparationOrders = await reparationOrderService.findReparationOrders(params.filter, params);
        const total = await reparationOrderService.countReparationOrders(params.filter);
        if (reparationOrders.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Ordenes de reparaciones no encontrados", 404));
            return;
        }
        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(
                    reparationOrders,
                    pagination,
                    "Ordenes de reparacion encontrados exitosamente"
                )
            );
            return;
        } else {
            res.status(200).json(
                ResponseHandler.success(reparationOrders, "Ordenes de reparacion encontrados exitosamente")
            );
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar Ordenes de reparacion:", error.message);
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
export const findReparationOrderById = async (req: Request, res: Response) => {
    try {
        const reparationOrder = await reparationOrderService.findReparationOrderById(req.params.id);
        if (!reparationOrder) {
            res.status(404).json(ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(reparationOrder, "Ordenes de reparacion encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar Ordenes de reparacion:", error.message);
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
export const createReparationOrder = async (req: Request, res: Response) => {
    try {
        const newReparationOrder: ReparationOrder = req.body;
        // Verificar si el workshop.id existe y si el usuario actual pertenece a ese workshop

        const workshopId = newReparationOrder.workshop;
        const userId = req.currentUser?.id;
        
        const workshopExists = await workshopService.findWorkshopById(workshopId as unknown as string);
        const currentUser = req.currentUser;
        
        // Verificar si el usuario pertenece al workshop
        let userBelongsToWorkshop = false;
        
        if (workshopExists && currentUser) {
            // Verificar si es el administrador del workshop
            const isWorkshopAdmin = workshopExists.workshopAdmin.toString() === userId;
            
            // Verificar si es empleado del workshop
            const isEmployee = workshopExists.employees?.some(employeeId => 
                employeeId.toString() === userId
            ) || false;
            
            // Verificar si es cliente del workshop
            const isClient = workshopExists.clients?.some(clientId => 
                clientId.toString() === userId
            ) || false;
            
            userBelongsToWorkshop = isWorkshopAdmin || isEmployee || isClient;
        }
        
        if (!workshopExists || !userBelongsToWorkshop) {
            res.status(403).json(ResponseHandler.forbidden("El workshop no existe o el usuario no pertenece a este workshop", 403));
            return;
        }
        const result = await reparationOrderService.createReparationOrder(newReparationOrder);
        res.status(201).json(ResponseHandler.success(result, "orden de reparacion creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear Ordenes de reparacion:", error.message);
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
export const updateReparationOrder = async (req: Request, res: Response) => {
    try {
        const reparationOrder = await reparationOrderService.updateReparationOrder(req.params.id, req.body);
        if (!reparationOrder) {
            res.status(404).json(ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404));
            return;
        }
        res.status(200).json(
            ResponseHandler.success(reparationOrder, "Ordenes de reparacion actualizado exitosamente")
        );
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar Ordenes de reparacion:", error.message);
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
export const deleteReparationOrder = async (req: Request, res: Response) => {
    try {
        const reparationOrder = await reparationOrderService.deleteReparationOrder(req.params.id, req.currentUser?.id);
        if (!reparationOrder) {
            res.status(404).json(ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(reparationOrder, "Ordenes de reparacion eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar Ordenes de reparacion:", error.message);
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
export const restoreReparationOrder = async (req: Request, res: Response) => {
    try {
        const reparationOrder = await reparationOrderService.restoreReparationOrder(req.params.id);
        if (!reparationOrder) {
            res.status(404).json(ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(reparationOrder, "Ordenes de reparacion restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar Ordenes de reparacion:", error.message);
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
