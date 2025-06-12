import { UserTypesEnum } from "enums/UserTypes.enums";
import { Types } from "mongoose";
import { ContactRepository } from "repositories/contactRepositories";
import { RolesRepository } from "repositories/rolesRepositories";
import { UserRepository } from "repositories/userRepositories";
import { ContactService } from "services/contactService";
import { RolesService } from "services/RolesService";
import { UserService } from "services/userService";
import { Contact } from "types/ContactTypes";
import { Roles } from "types/RolesTypes";
import { User } from "types/UserTypes";
const rolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);

export const createInitialSetup = async () => {
    try {
        // Verificar si ya existen roles
        const roles = await rolesService.findRoles();
        const users = await userService.findUsers();
        if (roles.length > 0 && users.length > 0) return;
        // Crear roles iniciales
        const superAdminRole = await rolesService.createRoles({
            name: "superAdmin",
            permissions: ["admin_granted"],
        } as Roles);
        const workshopAdminRole = await rolesService.createRoles({
            name: "workshopAdmin",
            permissions: [
                "users_read",
                "users_update",
                "users_create",
                "subscription_read",
                "subscription_duration_read",
                "workshop_read",
                "workshop_update",
                "contact_update",
            ],
        } as Roles);
        const employeeRole = await rolesService.createRoles({
            name: "employee",
            permissions: ["users_read", "users_update", "contact_update"],
        } as Roles);
        const clientRole = await rolesService.createRoles({
            name: "client",
            permissions: ["users_read", "users_update", "contact_update"],
        } as Roles);

        // Crear Contactos
        // contactSuperAdmin
        const contactSuperAdmin = await contactService.createContact({
            name: "Super",
            surname: "Admin",
            phone: "123456789",
            address: "Super Street 123",
            state: "Super State",
            city: "Super City",
            postalCode: "12345",
            country: "Super Country",
        } as Contact);
        const contactWorkshopAdmin = await contactService.createContact({
            name: "Workshop",
            surname: "Admin",
            phone: "987654321",
            address: "Workshop Street 123",
            state: "Workshop State",
            city: "Workshop City",
            postalCode: "54321",
            country: "Workshop Country",
        } as Contact);
        const contactEmployeeOne = await contactService.createContact({
            name: "Employee",
            surname: "One",
            phone: "111222333",
            address: "Employee Street 1",
            state: "Employee State",
            city: "Employee City",
            postalCode: "11111",
            country: "Employee Country",
        } as Contact);
        const contactEmployeeOTwo = await contactService.createContact({
            name: "Employee",
            surname: "Two",
            phone: "111222333",
            address: "Employee Street 1",
            state: "Employee State",
            city: "Employee City",
            postalCode: "11111",
            country: "Employee Country",
        } as Contact);
        const contactClientOne = await contactService.createContact({
            name: "Client",
            surname: "One",
            phone: "444555666",
            address: "Client Street 1",
            state: "Client State",
            city: "Client City",
            postalCode: "44444",
            country: "Client Country",
        } as Contact);
        const contactClientTwo = await contactService.createContact({
            name: "Client",
            surname: "One",
            phone: "444555666",
            address: "Client Street 1",
            state: "Client State",
            city: "Client City",
            postalCode: "44444",
            country: "Client Country",
        } as Contact);

        // Crear usuarios iniciales
        // Super Admin
        const superAdmin = await userService.createUser({
            email: "superadmin@tutaller.com",
            password: "superadmin123",
            contact: contactSuperAdmin._id,
            userTypes: [UserTypesEnum.SUPER_ADMIN],
            roles: [superAdminRole._id as unknown as Types.ObjectId],
            permissions: ["admin_granted"],
        } as User);
        // Workshop Admin
        const workshopAdmin = await userService.createUser({
            email: "workshopadmin@tutaller.com",
            password: "workshop123",
            contact: contactWorkshopAdmin._id,
            userTypes: [UserTypesEnum.WORKSHOP_ADMIN],
            roles: [workshopAdminRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update", "users_create"],
            workshopAdminProfile: {
                managedWorkshops: [],
            },
        } as unknown as User);
        // Empleados
        const employeeOne = await userService.createUser({
            email: "employee1@tutaller.com",
            password: "employee123",
            contact: contactEmployeeOne._id,
            userTypes: [UserTypesEnum.EMPLOYEE],
            roles: [employeeRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            employeeProfile: {
                workshops: [],
                category: "Mechanic",
                speciality: "Engine",
            },
        } as unknown as User);
        const employeeTwo = await userService.createUser({
            email: "employee2@tutaller.com",
            password: "employee123",
            contact: contactEmployeeOTwo._id,
            userTypes: [UserTypesEnum.EMPLOYEE],
            roles: [employeeRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            employeeProfile: {
                workshops: [],
                category: "Electrician",
                speciality: "Electronics",
            },
        } as unknown as User);
        // Clientes
        const clientOne = await userService.createUser({
            email: "client1@tutaller.com",
            password: "client123",
            contact: contactClientOne._id,
            userTypes: [UserTypesEnum.CLIENT],
            roles: [clientRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            clientProfile: {
                preferredWorkshops: [],
            },
        } as unknown as User);
        const clientTwo = await userService.createUser({
            email: "client2@tutaller.com",
            password: "client123",
            contact: contactClientTwo._id,
            userTypes: [UserTypesEnum.CLIENT],
            roles: [clientRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            clientProfile: {
                preferredWorkshops: [],
            },
        } as unknown as User);
        // Actualizar contactos con los usuarios
        await contactService.updateContact(contactSuperAdmin._id as string, {
            userId: superAdmin._id,
        } as Contact);
        await contactService.updateContact(contactWorkshopAdmin._id as string, {
            userId: workshopAdmin._id,
        } as Contact);
        await contactService.updateContact(contactEmployeeOne._id as string, {
            userId: employeeOne._id,
        } as Contact);
        await contactService.updateContact(contactEmployeeOTwo._id as string, {
            userId: employeeTwo._id,
        } as Contact);
        await contactService.updateContact(contactClientOne._id as string, {
            userId: clientOne._id,
        } as Contact);
        await contactService.updateContact(contactClientTwo._id as string, {
            userId: clientTwo._id,
        } as Contact);
        // Crear talleres
        console.log("Initial setup completed successfully");
    } catch (error) {
        console.error("Error in initial setup:", error);
    }
};
