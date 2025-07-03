import { RolesRepository } from "repositories/rolesRepositories";
import { RolesService } from "services/rolesService";
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";
import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { Params } from "types/RepositoryTypes";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";

const rolesRepository: InterfaceRolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);

export const findRoles = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const roles = await rolesService.findRoles(params.filter, params);
        const total = await rolesService.countRoles(params.filter);
        if (roles.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Roles no encontrados", 404));
            return;
        }
        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(roles, pagination, "Roles encontrados exitosamente")
            );
            return;
        } else {
            res.status(200).json(ResponseHandler.success(roles, "Roles encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al buscar Roles:", error.message);
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

export const findRolesById = async (req: Request, res: Response) => {
    try {
        const role = await rolesService.findRolesById(req.params.id);
        if (!role) {
            res.status(404).json(ResponseHandler.notFound("Rol no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(role, "Rol encontrado exitosamente"));
        return;
   } catch (error) {
        console.error("Error al buscar rol:", error);
        if (error instanceof mongoose.Error || error === 'CastError') {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        }
        res.status(500).json(ResponseHandler.error("Error interno del servidor"));
        return;
    }
};

export const createRoles = async (req: Request, res: Response) => {
    try {
        const newRoles: Roles = req.body;
        const result = await rolesService.createRoles(newRoles);
        res.status(201).json(ResponseHandler.success(result, "Rol creado exitosamente", 201));
        return;
    } catch (error) {
        console.error("Error al crear rol:", error);
        if (error instanceof mongoose.Error) {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        }
        res.status(400).json(ResponseHandler.badRequest("Error al crear el rol", 400));
        return;
    }
};

export const updateRoles = async (req: Request, res: Response) => {
    try {
        const role = await rolesService.updateRoles(req.params.id, req.body);
        if (!role) {
            res.status(404).json(ResponseHandler.notFound("Rol no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(role, "Rol actualizado exitosamente"));
        return;
    } catch (error) {
        console.error("Error al actualizar rol:", error);
        if (error instanceof mongoose.Error) {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        }
        res.status(500).json(ResponseHandler.error("Error interno del servidor"));
        return;
    }
};

export const deleteRoles = async (req: Request, res: Response) => {
    try {
        const role = await rolesService.deleteRoles(req.params.id, req.currentUser?.id);
        if (!role) {
            res.status(404).json(ResponseHandler.notFound("Rol no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(role, "Rol eliminado exitosamente"));
        return;
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        if (error instanceof mongoose.Error) {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        }
        res.status(500).json(ResponseHandler.error("Error interno del servidor"));
        return;
    }
};

export const restoreRoles = async (req: Request, res: Response) => {
    try {
        const roles = await rolesService.restoreRoles(req.params.id);
        if (!roles) {
            res.status(404).json(ResponseHandler.notFound("Rol no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(roles, "Rol restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar Rol:", error.message);
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
