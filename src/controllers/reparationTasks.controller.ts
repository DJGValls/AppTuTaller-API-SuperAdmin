import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { InterfaceReparationTaskRepository, ReparationTask } from "types/ReparationTaskTypes";
import { ReparationTaskRepository } from "repositories/reparationTaskRepositories";
import { ReparationTaskService } from "services/reparationTaskService";
import { InterfaceWorkshopRepository } from "types/WorkshopTypes";
import { WorkshopRepository } from "repositories/workshopRepositories";
import { WorkshopService } from "services/workshopService";

const reparationTaskRepository: InterfaceReparationTaskRepository = new ReparationTaskRepository();
const reparationTaskService = new ReparationTaskService(reparationTaskRepository);
const workshopRepository: InterfaceWorkshopRepository = new WorkshopRepository();
const workshopService = new WorkshopService(workshopRepository);

export const findReparationTasks = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        
        const reparationTasks = await reparationTaskService.findReparationTasks(params.filter, params);
        const total = await reparationTaskService.countReparationTasks(params.filter);
        
        if (reparationTasks.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Tareas de reparación no encontradas", 404));
            return;
        }
        
        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(
                    reparationTasks,
                    pagination,
                    "Tareas de reparación encontradas exitosamente"
                )
            );
            return;
        } else {
            res.status(200).json(
                ResponseHandler.success(reparationTasks, "Tareas de reparación encontradas exitosamente")
            );
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar tareas de reparación:", error.message);
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

export const findReparationTaskById = async (req: Request, res: Response) => {
    try {
        const reparationTask = await reparationTaskService.findReparationTaskById(req.params.id);
        if (!reparationTask) {
            res.status(404).json(ResponseHandler.notFound("Tarea de reparación no encontrada", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(reparationTask, "Tarea de reparación encontrada exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar tarea de reparación:", error.message);
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

export const createReparationTask = async (req: Request, res: Response) => {
    try {
        const newReparationTask: ReparationTask = req.body;
        
        // Verificar si el workshop existe y si el usuario actual pertenece a ese workshop
        const workshopId = newReparationTask.workshop;
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
            
            userBelongsToWorkshop = isWorkshopAdmin || isEmployee;
        }
        
        if (!workshopExists || !userBelongsToWorkshop) {
            res.status(403).json(ResponseHandler.forbidden("El workshop no existe o el usuario no pertenece a este workshop", 403));
            return;
        }
        
        const result = await reparationTaskService.createReparationTask(newReparationTask);
        res.status(201).json(ResponseHandler.success(result, "Tarea de reparación creada exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear tarea de reparación:", error.message);
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

export const updateReparationTask = async (req: Request, res: Response) => {
    try {
        const reparationTask = await reparationTaskService.updateReparationTask(req.params.id, req.body);
        if (!reparationTask) {
            res.status(404).json(ResponseHandler.notFound("Tarea de reparación no encontrada", 404));
            return;
        }
        res.status(200).json(
            ResponseHandler.success(reparationTask, "Tarea de reparación actualizada exitosamente")
        );
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar tarea de reparación:", error.message);
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

export const deleteReparationTask = async (req: Request, res: Response) => {
    try {
        const reparationTask = await reparationTaskService.deleteReparationTask(req.params.id, req.currentUser?.id);
        if (!reparationTask) {
            res.status(404).json(ResponseHandler.notFound("Tarea de reparación no encontrada", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(reparationTask, "Tarea de reparación eliminada exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar tarea de reparación:", error.message);
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

export const restoreReparationTask = async (req: Request, res: Response) => {
    try {
        const reparationTask = await reparationTaskService.restoreReparationTask(req.params.id);
        if (!reparationTask) {
            res.status(404).json(ResponseHandler.notFound("Tarea de reparación no encontrada", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(reparationTask, "Tarea de reparación restaurada exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar tarea de reparación:", error.message);
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
