import { UserTypesEnum } from "enums/UserTypes.enums";
import { Types } from "mongoose";
import { RolesRepository } from "repositories/rolesRepositories";
import { UserRepository } from "repositories/userRepositories";
import { RolesService } from "services/RolesService";
import { UserService } from "services/userService";
import { Roles } from "types/RolesTypes";
import { User } from "types/UserTypes";
const rolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

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
        // Crear usuarios iniciales
        // Super Admin
        await userService.createUser({
            email: "superadmin@tutaller.com",
            password: "superadmin123",
            contact: {
                name: "Super",
                surname: "Admin",
                phone: "123456789",
                address: "Admin Street 123",
                state: "Admin State",
                city: "Admin City",
                postalCode: "12345",
                country: "Admin Country",
            },
            userTypes: [UserTypesEnum.SUPER_ADMIN],
            roles: [superAdminRole._id as unknown as Types.ObjectId],
            permissions: ["admin_granted"],
        } as User);
        // Workshop Admin
        await userService.createUser({
            email: "workshopadmin@tutaller.com",
            password: "workshop123",
            contact: {
                name: "Workshop",
                surname: "Admin",
                phone: "987654321",
                address: "Workshop Street 123",
                state: "Workshop State",
                city: "Workshop City",
                postalCode: "54321",
                country: "Workshop Country",
            },
            userTypes: [UserTypesEnum.WORKSHOP_ADMIN],
            roles: [workshopAdminRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update", "users_create"],
            workshopAdminProfile: {
                managedWorkshops: [],
            },
        } as unknown as User);
        // Empleados
        await userService.createUser({
            email: "employee1@tutaller.com",
            password: "employee123",
            contact: {
                name: "Employee",
                surname: "One",
                phone: "111222333",
                address: "Employee Street 1",
                state: "Employee State",
                city: "Employee City",
                postalCode: "11111",
                country: "Employee Country",
            },
            userTypes: [UserTypesEnum.EMPLOYEE],
            roles: [employeeRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            employeeProfile: {
                workshops: [],
                category: "Mechanic",
                speciality: "Engine",
            },
        } as unknown as User);
        await userService.createUser({
            email: "employee2@tutaller.com",
            password: "employee123",
            contact: {
                name: "Employee",
                surname: "Two",
                phone: "444555666",
                address: "Employee Street 2",
                state: "Employee State",
                city: "Employee City",
                postalCode: "22222",
                country: "Employee Country",
            },
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
        await userService.createUser({
            email: "client1@tutaller.com",
            password: "client123",
            contact: {
                name: "Client",
                surname: "One",
                phone: "777888999",
                address: "Client Street 1",
                state: "Client State",
                city: "Client City",
                postalCode: "33333",
                country: "Client Country",
            },
            userTypes: [UserTypesEnum.CLIENT],
            roles: [clientRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            clientProfile: {
                preferredWorkshops: [],
            },
        } as unknown as User);
        await userService.createUser({
            email: "client2@tutaller.com",
            password: "client123",
            contact: {
                name: "Client",
                surname: "Two",
                phone: "000111222",
                address: "Client Street 2",
                state: "Client State",
                city: "Client City",
                postalCode: "44444",
                country: "Client Country",
            },
            userTypes: [UserTypesEnum.CLIENT],
            roles: [clientRole._id as unknown as Types.ObjectId],
            permissions: ["users_read", "users_update"],
            clientProfile: {
                preferredWorkshops: [],
            },
        } as unknown as User);
        console.log("Initial setup completed successfully");
    } catch (error) {
        console.error("Error in initial setup:", error);
    }
};
