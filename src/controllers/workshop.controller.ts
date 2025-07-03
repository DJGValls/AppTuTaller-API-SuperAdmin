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
import { Contact, InterfaceContactRepository } from "types/ContactTypes";
import { ContactRepository } from "repositories/contactRepositories";
import { ContactService } from "services/contactService";
import { InterfaceUserRepository, User } from "types/UserTypes";
import { UserRepository } from "repositories/userRepositories";
import { UserService } from "services/userService";
import { UserTypesEnum } from "enums/UserTypes.enums";
import { InterfaceSubscriptionRepository } from "types/SubscriptionsTypes";
import { SubscriptionRepository } from "repositories/subscriptionRepositories";
import { SubscriptionService } from "services/subscriptionService";

const workshopRepository: InterfaceWorkshopRepository = new WorkshopRepository();
const workshopService = new WorkshopService(workshopRepository);
const contactRepository: InterfaceContactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const userRepository: InterfaceUserRepository = new UserRepository();
const userService = new UserService(userRepository);
const subscriptionRepository: InterfaceSubscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);

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
        let workshopData: Workshop = req.body;
        let contact: Contact;
        let workshopAdmin: User | null = null;
        
        // Verificar si el workshopData.workshopAdmin existe y es de tipo WORKSHOP_ADMIN
        if (workshopData.workshopAdmin) {
            workshopAdmin = (await userService.findUserById(workshopData.workshopAdmin as unknown as string)) as User;
            if (!workshopAdmin) {
                res.status(404).json(ResponseHandler.notFound("Usuario no encontrado", 404));
                return;
            }
            if (!workshopAdmin.userTypes.includes(UserTypesEnum.WORKSHOP_ADMIN)) {
                res.status(400).json(ResponseHandler.badRequest("El usuario no es de tipo WORKSHOP_ADMIN", 400));
                return;
            }
        }
        
        // verificar si el subscription existe
        if (workshopData.subscription) {
            const subscription = await subscriptionService.findSubscriptionById(
                workshopData.subscription as unknown as string
            );
            workshopData.subscription = subscription?._id;
        } else {
            const freeDemoSubscription = await subscriptionService.findSubscriptionByTitle("FREE_DEMO");
            if (!freeDemoSubscription) {
                res.status(404).json(ResponseHandler.notFound("Suscripción no encontrada", 404));
                return;
            }
            workshopData.subscription = freeDemoSubscription._id;
        }

        // Verificar si se proporcionó un ID de contacto o un objeto de contacto
        if (typeof workshopData.contact === "string") {
            // Si es un string, buscar el contacto existente
            const existingContact = await contactService.findContactById(workshopData.contact);
            if (!existingContact) {
                res.status(404).json(ResponseHandler.notFound("Contacto no encontrado", 404));
                return;
            }
            contact = existingContact;
        } else {
            // Si es un objeto, crear un nuevo contacto
            contact = await contactService.createContact(workshopData.contact as Contact);
            workshopData.contact = contact._id;
        }

        // creamos taller
        const result = await workshopService.createWorkshop(workshopData);

        // Actualizamos el contacto con el ID del taller
        await contactService.updateContact(
            contact._id as string,
            {
                workshopId: result._id,
            } as Contact
        );

        // Actualizamos el usuario en el workshopAdminProfile
        await userService.updateUser(
            workshopAdmin?._id as unknown as string,
            {
                workshopAdminProfile: {
                    isWorkshopAdmin: true,
                    managedWorkshops: [result._id],
                },
            } as User
        );
        res.status(201).json(
            ResponseHandler.success(result, "taller y contacto creado exitosamente y contacto actualizado", 201)
        );
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
