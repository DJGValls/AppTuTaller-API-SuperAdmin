import { UserRepository } from "repositories/userRepositories";
import { UserService } from "services/userService";
import { Request, Response } from "express";
import { InterfaceUserRepository, User } from "types/UserTypes";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";

const userRepository: InterfaceUserRepository = new UserRepository();
const userService = new UserService(userRepository);

export const findUsers = async (req: Request, res: Response) => {
    try {
        const params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter)
        };
        const users = await userService.findUsers(params.filter, params);
        if (users.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Usuarios no encontrados", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(users, "Usuarios encontrados exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar usuario:", error.message);
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

export const findUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.findUserById(req.params.id);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(user, "Usuario encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar usuario:", error.message);
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

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser: User = req.body;
        const result = await userService.createUser(newUser);
        res.status(201).json(ResponseHandler.success(result, "Usuario creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear usuario:", error.message);
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

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(user, "Usuario actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar usuario:", error.message);
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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(user, "Usuario eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar usuario:", error.message);
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
