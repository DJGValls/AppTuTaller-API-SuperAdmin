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
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";
import { RolesRepository } from "repositories/rolesRepositories";
import { RolesService } from "services/rolesService";
import { InterfaceWorkshopRepository, Workshop } from "types/WorkshopTypes";
import { WorkshopRepository } from "repositories/workshopRepositories";
import { WorkshopService } from "services/workshopService";

const userRepository: InterfaceUserRepository = new UserRepository();
const userService = new UserService(userRepository);
const contactRepository: InterfaceContactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const rolesRepository: InterfaceRolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);
const workshopRepository: InterfaceWorkshopRepository = new WorkshopRepository();
const workshopService = new WorkshopService(workshopRepository);

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
        let userData: User = req.body;
        let contact: Contact;
        
        // Verificar si se proporcionó un ID de contacto o un objeto de contacto
        if (typeof req.body.contact === "string") {
            // Si es un string, buscar el contacto existente
            const existingContact = await contactService.findContactById(req.body.contact);
            if (!existingContact) {
                res.status(404).json(ResponseHandler.notFound("Contacto no encontrado", 404));
                return;
            }
            contact = existingContact;
        } else {
            // Si es un objeto, crear un nuevo contacto
            const newContact = await contactService.createContact(req.body.contact);
            contact = newContact;
            userData.contact = newContact._id;
        }

        // Validar y obtener los roles
        const rolePromises = userData.roles.map((roleId) => rolesService.findRolesById(roleId.toString()));
        const roles = await Promise.all(rolePromises);
        
        // Filtrar roles nulos
        const validRoles = roles.filter((role): role is Roles => role !== null);
        
        if (validRoles.length !== userData.roles.length) {
            res.status(400).json(ResponseHandler.badRequest("Algunos roles no fueron encontrados", 400));
            return;
        }

        // Crear usuario con validación de permisos
        const { user: result, warnings } = await userService.createUserWithPermissions(userData, validRoles);
        
        if (!result) {
            res.status(400).json(ResponseHandler.badRequest("Error al crear el usuario", 400));
            return;
        }

        // Actualizar el contacto con el ID del usuario
        await contactService.updateContact(
            contact._id as string,
            {
                userId: result._id,
            } as Contact
        );

        // Log de seguridad para auditoría
        console.log(`Usuario creado: ${result.email} con permisos: ${result.permissions.join(', ')}`);
        if (warnings.length > 0) {
            console.warn(`Advertencias al crear usuario ${result.email}: ${warnings.join('; ')}`);
        }

        // Preparar respuesta
        const response = {
            user: result,
            warnings: warnings.length > 0 ? warnings : undefined
        };

        res.status(201).json(
            ResponseHandler.success(
                response, 
                warnings.length > 0 
                    ? "Usuario creado exitosamente con advertencias" 
                    : "Usuario creado exitosamente y contacto actualizado", 
                201
            )
        );
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
        // Primero obtenemos el usuario para verificar si existe y obtener su contacto
        const user = await userService.findUserById(req.params.id);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        // Eliminamos el contacto asociado si existe
        if (user.contact) {
            const contactDeleted = await contactService.deleteContact(user.contact.toString(), req.currentUser?.id);
            if (!contactDeleted) {
                res.status(500).json(ResponseHandler.error("Error al eliminar el contacto asociado"));
                return;
            }
        }
        // Eliminamos el usuario
        const userDeleted = await userService.deleteUser(req.params.id, req.currentUser?.id);
        if (!userDeleted) {
            res.status(404).json(ResponseHandler.notFound("Error al eliminar el usuario", 404));
            return;
        }
        res.status(200).json(ResponseHandler.success(userDeleted, "Usuario y contacto eliminados exitosamente"));
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
        // Primero restauramos el usuario para obtener su información
        const user = await userService.restoreUser(req.params.id);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        // Restauramos el contacto asociado si existe
        if (user.contact) {
            const contactRestored = await contactService.restoreContact(user.contact.toString());
            if (!contactRestored) {
                res.status(500).json(ResponseHandler.error("Error al restaurar el contacto asociado"));
                return;
            }
        }
        res.status(200).json(ResponseHandler.success(user, "Usuario y contacto restaurados exitosamente"));
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

export const subscribeWorkshop = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const workshopId = req.body.workshopId;

        // Primero obtenemos el usuario para verificar si existe y obtener su contacto
        const user = await userService.findUserById(userId);
        if (!user) {
            res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
            return;
        }
        const workshop = await workshopService.findWorkshopById(workshopId);
        if (!workshop) {
            res.status(404).json(ResponseHandler.notFound("Taller no encontrado", 404));
            return;
        }
        const userUpdated = await userService.updateUser(user._id as string, {
            clientProfile: {
                preferredWorkshops: workshop._id,
            },
        } as User);
        if (!userUpdated) {
            res.status(500).json(ResponseHandler.error("Error al inscribir taller en el usuario"));
            return;
        }
        const updatedWorkshop = await workshopService.updateWorkshop(workshop._id as string, {
            clients: user._id,
        } as Workshop);
        if (!updatedWorkshop) {
            res.status(500).json(ResponseHandler.error("Error al inscribir usuario en el taller"));
            return;
        }
        
        res.status(200).json(ResponseHandler.success(userUpdated, "Taller inscrito exitosamente"));

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error al inscribir usuario en el taller:", error.message);
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
