import { UserRepository } from "repositories/userRepositories";
import { UserService } from "services/userService";
import { Request, Response } from "express";
import { InterfaceUserRepository, User } from "types/UserTypes";
import { ResponseHandler } from "utils/ResponseHandler";
import mongoose from "mongoose";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { Params } from "types/RepositoryTypes";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";
import { Contact, InterfaceContactRepository } from "types/ContactTypes";
import { ContactRepository } from "repositories/contactRepositories";
import { ContactService } from "services/contactService";

const userRepository: InterfaceUserRepository = new UserRepository();
const userService = new UserService(userRepository);
const contactRepository: InterfaceContactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);

export const findUsers = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const users = await userService.findUsers(params.filter, params);
        const total = await userService.countUsers(params.filter);
        if (users.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Usuarios no encontrados", 404));
            return;
        }
        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(users, pagination, "Usuarios encontrados exitosamente")
            );
            return;
        } else {
            res.status(200).json(ResponseHandler.success(users, "Usuarios encontrados exitosamente"));
            return;
        }
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
        // Primero creamos el contacto
        const contactData = req.body.contact;
        let userData: User;
        let contactId: string | unknown;

        if (typeof contactData === "object") {
            const contact = await contactService.createContact(contactData);
            if (!contact) {
                res.status(400).json(ResponseHandler.badRequest("Error al crear el contacto", 400));
                return;
            }
            // Creamos el usuario con el ID del contacto
            contactId = contact._id;
            userData = {
                ...req.body,
                contact: contactId, // Reemplazamos la info del contacto con su ID
            };
        } else {
            userData = req.body;
        }

        const result = await userService.createUser(userData);

        if (!result) {
            res.status(400).json(ResponseHandler.badRequest("Error al crear el usuario", 400));
            return;
        }

        // Actualizamos el contacto con el ID del usuario
        await contactService.updateContact(typeof contactData === "object" ? contactId : contactData, {
            userId: result._id,
        });
        // Devolvemos el usuario creado con el contacto populado
        const userWithContact = await userService.findUserById(result._id as string);

        res.status(201).json(ResponseHandler.success(userWithContact, "Usuario creado exitosamente", 201));
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
        const user = await userService.deleteUser(req.params.id, req.currentUser?.id);
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

export const restoreUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.restoreUser(req.params.id);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(user, "Usuario restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar usuario:", error.message);
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
