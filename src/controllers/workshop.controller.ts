import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { WorkshopRepository } from "repositories/workshopRepositories";
import { WorkshopService } from "services/workshopService";
import { InterfaceWorkshopRepository, Workshop } from "types/WorkshopTypes";

const workshopRepository: InterfaceWorkshopRepository = new WorkshopRepository();
const workshopService = new WorkshopService(workshopRepository);

export const findWorkshops = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const workshops = await workshopService.findWorkshops(params.filter, params);
        const total = await workshopService.countWorkshops(params.filter);
        if (workshops.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Talleres no encontrados", 404));
            return;
        }
        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(workshops, pagination, "Talleres encontrados exitosamente")
            );
            return;
        } else {
            res.status(200).json(ResponseHandler.success(workshops, "Talleres encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar talleres:", error.message);
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
export const findWorkshopById = async (req: Request, res: Response) => {
    try {
        const workshop = await workshopService.findWorkshopById(req.params.id);
        if (!workshop) {
            res.status(404).json(ResponseHandler.notFound("Taller no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(workshop, "Taller encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar taller:", error.message);
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
export const createWorkshop = async (req: Request, res: Response) => {
    try {
        const newWorkshop: Workshop = req.body;
        const result = await workshopService.createWorkshop(newWorkshop);
        res.status(201).json(ResponseHandler.success(result, "Taller creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear taller:", error.message);
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
export const updateWorkshop = async (req: Request, res: Response) => {
    try {
        const workshop = await workshopService.updateWorkshop(req.params.id, req.body);
        if (!workshop) {
            res.status(404).json(ResponseHandler.notFound("Taller no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(workshop, "Taller actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar taller:", error.message);
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
export const deleteWorkshop = async (req: Request, res: Response) => {
    try {
        const workshop = await workshopService.deleteWorkshop(req.params.id, req.currentUser?.id);
        if (!workshop) {
            res.status(404).json(ResponseHandler.notFound("Taller no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(workshop, "Taller eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar taller:", error.message);
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
export const restoreWorkshop = async (req: Request, res: Response) => {
    try {
        const workshop = await workshopService.restoreWorkshop(req.params.id);
        if (!workshop) {
            res.status(404).json(ResponseHandler.notFound("Taller no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(workshop, "Taller restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar taller:", error.message);
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
