import { RolesRepository } from "repositories/rolesRepositories";
import { RolesService } from "services/RolesService";
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";
import { Request, Response } from "express";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";

const rolesRepository: InterfaceRolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);

export const findRoles = async (req: Request, res: Response) => {
    try {
        const result = await rolesService.findRoles(req.query);
        if (result.items.length === 0) {
            res.status(404).json(ResponseHandler.notFound("No se encontraron roles", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(result, "Roles encontrados exitosamente"));
        return;
    } catch (error) {
        console.error("Error al buscar roles:", error);
        if (error instanceof mongoose.Error) {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        }
        res.status(500).json(ResponseHandler.error("Error interno del servidor"));
        return;
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
        if (error instanceof mongoose.Error) {
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
        const role = await rolesService.deleteRoles(req.params.id);
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
