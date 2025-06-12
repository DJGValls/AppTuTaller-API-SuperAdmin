import { Request, Response } from "express";
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
// import { InterfaceUserRepository } from "types/UserTypes";
// import { UserRepository } from "repositories/userRepositories";
// import { UserService } from "services/userService";

const contactRepository: InterfaceContactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
// const userRepository: InterfaceUserRepository = new UserRepository();
// const userService = new UserService(userRepository);

export const findContacts = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };
        const contacts = await contactService.findContacts(params.filter, params);
        const total = await contactService.countContacts(params.filter);
        if (contacts.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Contactos no encontrados", 404));
            return;
        }
        if (!params.all || params.all === 'false' || params.all === '0') {
            const pagination = paginationBuilder(params, total)
            res.status(200).json(ResponseHandler.paginationSuccess(contacts, pagination, "Contactos encontrados exitosamente"));
            return
        } else {
            res.status(200).json(ResponseHandler.success(contacts, "Contactos encontrados exitosamente"));
            return;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar Contacto:", error.message);
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

export const findContactById = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.findContactById(req.params.id);
        if (!contact) {
            res.status(404).json(ResponseHandler.notFound("Contacto no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(contact, "Contacto encontrado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Error conocido con mensaje
            console.error("Error al buscar Contacto:", error.message);
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

export const createContact = async (req: Request, res: Response) => {
    try {
        const newcontact: Contact = req.body;
        const result = await contactService.createContact(newcontact);
        res.status(201).json(ResponseHandler.success(result, "Contacto creado exitosamente", 201));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al crear Contacto:", error.message);
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

export const updateContact = async (req: Request, res: Response) => {
    
    try {
        const contact = await contactService.updateContact(req.params.id, req.body);
        if (!contact) {
            res.status(404).json(ResponseHandler.notFound("Contacto no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(contact, "Contacto actualizado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al actualizar Contacto:", error.message);
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

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.deleteContact(req.params.id, req.currentUser?.id);
        if (!contact) {
            res.status(404).json(ResponseHandler.notFound("Contacto no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(contact, "Contacto eliminado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al eliminar Contacto:", error.message);
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

export const restoreContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.restoreContact(req.params.id);
        if (!contact) {
            res.status(404).json(ResponseHandler.notFound("Contacto no encontrado", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(contact, "Contacto restaurado exitosamente"));
        return;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al restaurar Contacto:", error.message);
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
