import { UserTypesEnum } from "enums/UserTypes.enums";
import { Types } from "mongoose";
import { ContactRepository } from "repositories/contactRepositories";
import { RolesRepository } from "repositories/rolesRepositories";
import { SubscriptionDurationRepository } from "repositories/subscriptionDurationRepositories";
import { SubscriptionRepository } from "repositories/subscriptionRepositories";
import { UserRepository } from "repositories/userRepositories";
import { ContactService } from "services/contactService";
import { RolesService } from "services/RolesService";
import { SubscriptionDurationService } from "services/subscriptionDurationService";
import { SubscriptionService } from "services/subscriptionService";
import { UserService } from "services/userService";
import { Contact } from "types/ContactTypes";
import { Roles } from "types/RolesTypes";
import { SubscriptionDuration } from "types/SubscriptionsDurationTypes";
import { Subscription } from "types/SubscriptionsTypes";
import { User } from "types/UserTypes";
const rolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionDurationRepository = new SubscriptionDurationRepository();
const subscriptionDurationService = new SubscriptionDurationService(subscriptionDurationRepository);

export const createInitialSetup = async () => {
    try {
        // Verificar si ya existen roles
        const roles = await rolesService.findRoles();
        const users = await userService.findUsers();
        const contacts = await contactService.findContacts();
        const subscriptionDurations = await subscriptionDurationService.findSubscriptionDurations();
        const subscriptions = await subscriptionService.findSubscriptions()

        let superAdminRole: Roles | undefined;
        let workshopAdminRole: Roles | undefined;
        let employeeRole: Roles | undefined;
        let clientRole: Roles | undefined;

        let contactSuperAdmin: Contact | undefined;
        let contactWorkshopAdmin: Contact | undefined;
        let contactEmployeeOne: Contact | undefined;
        let contactEmployeeOTwo: Contact | undefined;
        let contactClientOne: Contact | undefined;
        let contactClientTwo: Contact | undefined;

        let superAdmin: User;
        let workshopAdmin: User;
        let employeeOne: User;
        let employeeTwo: User;
        let clientOne: User;
        let clientTwo: User;

        let fortNigthNotRecurring: SubscriptionDuration | undefined;
        let fortNigthRecurring: SubscriptionDuration | undefined; 
        let monthlyRecurring: SubscriptionDuration | undefined; 
        let yearlyRecurring: SubscriptionDuration | undefined; 

        let freeDemo: Subscription;
        let basic: Subscription;
        let pro: Subscription;
        let premium: Subscription;

        // Crear roles iniciales
        if (roles.length === 0) {
            superAdminRole = await rolesService.createRoles({
                name: "superAdmin",
                permissions: ["admin_granted"],
            } as Roles);
            workshopAdminRole = await rolesService.createRoles({
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
            employeeRole = await rolesService.createRoles({
                name: "employee",
                permissions: ["users_read", "users_update", "contact_update"],
            } as Roles);
            clientRole = await rolesService.createRoles({
                name: "client",
                permissions: ["users_read", "users_update", "contact_update"],
            } as Roles);
        }

        // Crear Suscripciones
        if (subscriptions.length === 0) {
            if (subscriptionDurations.length === 0) {
                fortNigthNotRecurring =  await subscriptionDurationService.createSubscriptionDuration({
                    title: "Fortnight Not Recurring",
                    durationInDays: 15,
                    isRecurring: false,
                    expirationDate: new Date(new Date().setDate(new Date().getDate() + 15))
                } as SubscriptionDuration);
                fortNigthRecurring = await subscriptionDurationService.createSubscriptionDuration({
                    title: "Fortnight Recurring",
                    durationInDays: 15,
                    isRecurring: true
                } as SubscriptionDuration);
                monthlyRecurring = await subscriptionDurationService.createSubscriptionDuration({
                    title: "Monthly Recurring",
                    durationInDays: 30,
                    isRecurring: true
                } as SubscriptionDuration);
                yearlyRecurring = await subscriptionDurationService.createSubscriptionDuration({
                    title: "Yearly Recurring",
                    durationInDays: 365,
                    isRecurring: true
                } as SubscriptionDuration);
            }
            freeDemo = await subscriptionService.createSubscription({
                title: "FREE_DEMO",
                maxEmployees: 1,
                description: "Suscripcion Free Demo",
                price: 0,
                subscriptionDuration: fortNigthNotRecurring?._id as unknown as Types.ObjectId,
            } as Subscription);
            basic = await subscriptionService.createSubscription({
                title: "BASIC_MONTHLY",
                maxEmployees: 3,
                description: "Suscripcion Basic con maximo 3 empleados, pago mensual y recurrente",
                price: 10,
                subscriptionDuration: monthlyRecurring?._id as unknown as Types.ObjectId,
            } as Subscription);
            pro = await subscriptionService.createSubscription({
                title: "PRO_MONTHLY",
                maxEmployees: 10,
                description: "Suscripcion pro con maximo 10 empleados, pago mensual y recurrente",
                price: 25,
                subscriptionDuration: monthlyRecurring?._id as unknown as Types.ObjectId,
            } as Subscription);
            premium = await subscriptionService.createSubscription({
                title: "PREMIUM_MONTHLY",
                maxEmployees: 50,
                description: "Suscripcion Premium con maximo 50 empleados, pago mensual y recurrente",
                price: 50,
                subscriptionDuration: monthlyRecurring?._id as unknown as Types.ObjectId,
            } as Subscription);
        }

        // Crear usuarios iniciales
        if (users.length === 0) {
            // Crear Contactos
            if (contacts.length === 0) {
                contactSuperAdmin = await contactService.createContact({
                    name: "Super",
                    surname: "Admin",
                    phone: "123456789",
                    address: "Super Street 123",
                    state: "Super State",
                    city: "Super City",
                    postalCode: "12345",
                    country: "Super Country",
                } as Contact);
                contactWorkshopAdmin = await contactService.createContact({
                    name: "Workshop",
                    surname: "Admin",
                    phone: "987654321",
                    address: "Workshop Street 123",
                    state: "Workshop State",
                    city: "Workshop City",
                    postalCode: "54321",
                    country: "Workshop Country",
                } as Contact);
                contactEmployeeOne = await contactService.createContact({
                    name: "Employee",
                    surname: "One",
                    phone: "111222333",
                    address: "Employee Street 1",
                    state: "Employee State",
                    city: "Employee City",
                    postalCode: "11111",
                    country: "Employee Country",
                } as Contact);
                contactEmployeeOTwo = await contactService.createContact({
                    name: "Employee",
                    surname: "Two",
                    phone: "111222333",
                    address: "Employee Street 1",
                    state: "Employee State",
                    city: "Employee City",
                    postalCode: "11111",
                    country: "Employee Country",
                } as Contact);
                contactClientOne = await contactService.createContact({
                    name: "Client",
                    surname: "One",
                    phone: "444555666",
                    address: "Client Street 1",
                    state: "Client State",
                    city: "Client City",
                    postalCode: "44444",
                    country: "Client Country",
                } as Contact);
                contactClientTwo = await contactService.createContact({
                    name: "Client",
                    surname: "One",
                    phone: "444555666",
                    address: "Client Street 1",
                    state: "Client State",
                    city: "Client City",
                    postalCode: "44444",
                    country: "Client Country",
                } as Contact);
            }
            // Super Admin
            superAdmin = await userService.createUser({
                email: "superadmin@tutaller.com",
                password: "superadmin123",
                contact: contactSuperAdmin?._id as Contact,
                userTypes: [UserTypesEnum.SUPER_ADMIN],
                roles: [superAdminRole?._id as unknown as Types.ObjectId],
                permissions: ["admin_granted"],
            } as User);
            // Workshop Admin
            workshopAdmin = await userService.createUser({
                email: "workshopadmin@tutaller.com",
                password: "workshop123",
                contact: contactWorkshopAdmin?._id,
                userTypes: [UserTypesEnum.WORKSHOP_ADMIN],
                roles: [workshopAdminRole?._id as unknown as Types.ObjectId],
                permissions: ["users_read", "users_update", "users_create"],
                workshopAdminProfile: {
                    managedWorkshops: [],
                },
            } as unknown as User);
            // Empleados
            employeeOne = await userService.createUser({
                email: "employee1@tutaller.com",
                password: "employee123",
                contact: contactEmployeeOne?._id,
                userTypes: [UserTypesEnum.EMPLOYEE],
                roles: [employeeRole?._id as unknown as Types.ObjectId],
                permissions: ["users_read", "users_update"],
                employeeProfile: {
                    workshops: [],
                    category: "Mechanic",
                    speciality: "Engine",
                },
            } as unknown as User);
            employeeTwo = await userService.createUser({
                email: "employee2@tutaller.com",
                password: "employee123",
                contact: contactEmployeeOTwo?._id,
                userTypes: [UserTypesEnum.EMPLOYEE],
                roles: [employeeRole?._id as unknown as Types.ObjectId],
                permissions: ["users_read", "users_update"],
                employeeProfile: {
                    workshops: [],
                    category: "Electrician",
                    speciality: "Electronics",
                },
            } as unknown as User);
            // Clientes
            clientOne = await userService.createUser({
                email: "client1@tutaller.com",
                password: "client123",
                contact: contactClientOne?._id,
                userTypes: [UserTypesEnum.CLIENT],
                roles: [clientRole?._id as unknown as Types.ObjectId],
                permissions: ["users_read", "users_update"],
                clientProfile: {
                    preferredWorkshops: [],
                },
            } as unknown as User);
            clientTwo = await userService.createUser({
                email: "client2@tutaller.com",
                password: "client123",
                contact: contactClientTwo?._id,
                userTypes: [UserTypesEnum.CLIENT],
                roles: [clientRole?._id as unknown as Types.ObjectId],
                permissions: ["users_read", "users_update"],
                clientProfile: {
                    preferredWorkshops: [],
                },
            } as unknown as User);
            // Actualizar contactos con los usuarios
            await contactService.updateContact(
                contactSuperAdmin?._id as string,
                {
                    userId: superAdmin._id,
                } as Contact
            );
            await contactService.updateContact(
                contactWorkshopAdmin?._id as string,
                {
                    userId: workshopAdmin._id,
                } as Contact
            );
            await contactService.updateContact(
                contactEmployeeOne?._id as string,
                {
                    userId: employeeOne._id,
                } as Contact
            );
            await contactService.updateContact(
                contactEmployeeOTwo?._id as string,
                {
                    userId: employeeTwo._id,
                } as Contact
            );
            await contactService.updateContact(
                contactClientOne?._id as string,
                {
                    userId: clientOne._id,
                } as Contact
            );
            await contactService.updateContact(
                contactClientTwo?._id as string,
                {
                    userId: clientTwo._id,
                } as Contact
            );
        }

        
        

        // Crear talleres
        console.log("Initial setup completed successfully");
    } catch (error) {
        console.error("Error in initial setup:", error);
    }
};
