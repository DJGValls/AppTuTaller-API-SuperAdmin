import { UserTypesEnum } from "enums/UserTypes.enums";
import { UserPermissionsEnum } from "enums/UserPermissions.enums";
import { Types } from "mongoose";
import { ContactRepository } from "repositories/contactRepositories";
import { ReparationOrderRepository } from "repositories/reparationOrderRepositories";
import { ReparationTaskRepository } from "repositories/reparationTaskRepositories";
import { RolesRepository } from "repositories/rolesRepositories";
import { SubscriptionDurationRepository } from "repositories/subscriptionDurationRepositories";
import { SubscriptionRepository } from "repositories/subscriptionRepositories";
import { UserRepository } from "repositories/userRepositories";
import { WorkshopRepository } from "repositories/workshopRepositories";
import { ContactService } from "services/contactService";
import { ReparationOrderService } from "services/reparationOrderService";
import { ReparationTaskService } from "services/reparationTaskService";
import { RolesService } from "services/rolesService";
import { SubscriptionDurationService } from "services/subscriptionDurationService";
import { SubscriptionService } from "services/subscriptionService";
import { UserService } from "services/userService";
import { WorkshopService } from "services/workshopService";
import { Contact } from "types/ContactTypes";
import { ReparationOrder } from "types/ReparationOrderTypes";
import { ReparationTask } from "types/ReparationTaskTypes";
import { Roles } from "types/RolesTypes";
import { SubscriptionDuration } from "types/SubscriptionsDurationTypes";
import { Subscription } from "types/SubscriptionsTypes";
import { User } from "types/UserTypes";
import { Workshop } from "types/WorkshopTypes";
import { ActivationStatus } from "enums/StatusMethods.enum";
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
const workshopRepository = new WorkshopRepository();
const workshopService = new WorkshopService(workshopRepository);
const reparationOrderRepository = new ReparationOrderRepository();
const reparationOrderService = new ReparationOrderService(reparationOrderRepository);
const reparationTaskRepository = new ReparationTaskRepository();
const reparationTaskService = new ReparationTaskService(reparationTaskRepository);

export const createInitialSetup = async () => {
    try {
        console.log("Starting initial setup...");
        // Verificar si ya existen roles
        const roles = await rolesService.findRoles();
        const users = await userService.findUsers();
        const contacts = await contactService.findContacts();
        const subscriptionDurations = await subscriptionDurationService.findSubscriptionDurations();
        const subscriptions = await subscriptionService.findSubscriptions()
        const workshops = await workshopService.findWorkshops();
        const reparationOrders = await reparationOrderService.findReparationOrders();
        const reparationTasks = await reparationTaskService.findReparationTasks();

        console.log("Current database state:", {
            roles: roles.length,
            users: users.length,
            contacts: contacts.length,
            subscriptionDurations: subscriptionDurations.length,
            subscriptions: subscriptions.length,
            workshops: workshops.length,
            reparationOrders: reparationOrders.length,
            reparationTasks: reparationTasks.length
        });

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

        let workshop: Workshop;

        let reparationOrderOne: ReparationOrder;
        let reparationOrderTwo: ReparationOrder;

        let reparationTaskOne: ReparationTask;
        let reparationTaskTwo: ReparationTask;
        let reparationTaskThree: ReparationTask;

        // Crear roles iniciales
        if (roles.length === 0) {
            console.log("Creating roles...");
            superAdminRole = await rolesService.createRoles({
                name: "superAdmin",
                permissions: [UserPermissionsEnum.ADMIN_GRANTED],
            } as Roles);
            workshopAdminRole = await rolesService.createRoles({
                name: "workshopAdmin",
                permissions: [
                    UserPermissionsEnum.USERS_READ,
                    UserPermissionsEnum.USERS_UPDATE,
                    UserPermissionsEnum.USERS_CREATE,
                    UserPermissionsEnum.WORKSHOPS_READ,
                    UserPermissionsEnum.WORKSHOPS_UPDATE,
                    UserPermissionsEnum.WORKSHOPS_MANAGE,
                    UserPermissionsEnum.CONTACTS_UPDATE,
                    UserPermissionsEnum.REPARATION_ORDERS_READ,
                    UserPermissionsEnum.REPARATION_ORDERS_CREATE,
                    UserPermissionsEnum.REPARATION_ORDERS_UPDATE,
                    UserPermissionsEnum.REPARATION_ORDERS_DELETE,
                    UserPermissionsEnum.REPARATION_TASKS_READ,
                    UserPermissionsEnum.REPARATION_TASKS_CREATE,
                    UserPermissionsEnum.REPARATION_TASKS_UPDATE,
                    UserPermissionsEnum.REPARATION_TASKS_DELETE,
                    // Permisos de citas
                    UserPermissionsEnum.APPOINTMENTS_READ,
                    UserPermissionsEnum.APPOINTMENTS_CREATE,
                    UserPermissionsEnum.APPOINTMENTS_UPDATE,
                    UserPermissionsEnum.APPOINTMENTS_DELETE,
                    UserPermissionsEnum.APPOINTMENTS_MANAGE,
                    UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY,
                    // Permisos de horarios de taller
                    UserPermissionsEnum.WORKSHOP_SCHEDULES_READ,
                    UserPermissionsEnum.WORKSHOP_SCHEDULES_CREATE,
                    UserPermissionsEnum.WORKSHOP_SCHEDULES_UPDATE,
                    UserPermissionsEnum.WORKSHOP_SCHEDULES_DELETE,
                    UserPermissionsEnum.WORKSHOP_SCHEDULES_MANAGE,
                ],
            } as Roles);
            employeeRole = await rolesService.createRoles({
                name: "employee",
                permissions: [
                    UserPermissionsEnum.USERS_READ, 
                    UserPermissionsEnum.USERS_UPDATE, 
                    UserPermissionsEnum.CONTACTS_UPDATE,
                    UserPermissionsEnum.REPARATION_ORDERS_READ,
                    UserPermissionsEnum.REPARATION_ORDERS_UPDATE,
                    UserPermissionsEnum.REPARATION_TASKS_READ,
                    UserPermissionsEnum.REPARATION_TASKS_CREATE,
                    UserPermissionsEnum.REPARATION_TASKS_UPDATE,
                    // Permisos de citas (solo lectura y gestión)
                    UserPermissionsEnum.APPOINTMENTS_READ,
                    UserPermissionsEnum.APPOINTMENTS_MANAGE, // puede iniciar/completar
                    UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY,
                    // Permisos de horarios (solo lectura)
                    UserPermissionsEnum.WORKSHOP_SCHEDULES_READ,
                ],
            } as Roles);
            clientRole = await rolesService.createRoles({
                name: "client",
                permissions: [
                    UserPermissionsEnum.USERS_READ, 
                    UserPermissionsEnum.USERS_UPDATE, 
                    UserPermissionsEnum.CONTACTS_UPDATE,
                    UserPermissionsEnum.REPARATION_ORDERS_READ,
                    UserPermissionsEnum.REPARATION_TASKS_READ,
                    // Permisos de citas (crear y ver sus propias citas)
                    UserPermissionsEnum.APPOINTMENTS_READ,
                    UserPermissionsEnum.APPOINTMENTS_CREATE,
                    UserPermissionsEnum.APPOINTMENTS_UPDATE, // sus propias citas
                    UserPermissionsEnum.APPOINTMENTS_VIEW_AVAILABILITY,
                ],
            } as Roles);
            console.log("Roles created successfully");
        } else {
            console.log(`Roles already exist: ${roles.length} found`);
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
                permissions: [UserPermissionsEnum.ADMIN_GRANTED],
            } as User);
            // Workshop Admin
            workshopAdmin = await userService.createUser({
                email: "workshopadmin@tutaller.com",
                password: "workshop123",
                contact: contactWorkshopAdmin?._id,
                userTypes: [UserTypesEnum.WORKSHOP_ADMIN],
                roles: [workshopAdminRole?._id as unknown as Types.ObjectId],
                permissions: [
                    UserPermissionsEnum.WORKSHOPS_READ, 
                    UserPermissionsEnum.WORKSHOPS_UPDATE, 
                    UserPermissionsEnum.USERS_UPDATE, 
                    UserPermissionsEnum.USERS_CREATE
                ],
                workshopAdminProfile: {
                    managedWorkshops: [],
                    isWorkshopAdmin: true,
                },
            } as unknown as User);
            // Empleados
            employeeOne = await userService.createUser({
                email: "employee1@tutaller.com",
                password: "employee123",
                contact: contactEmployeeOne?._id,
                userTypes: [UserTypesEnum.EMPLOYEE],
                roles: [employeeRole?._id as unknown as Types.ObjectId],
                permissions: [UserPermissionsEnum.WORKSHOPS_READ, UserPermissionsEnum.USERS_UPDATE],
                employeeProfile: {
                    workshops: [],
                    category: "Mechanic",
                    speciality: "Engine",
                    isEmployee: true,
                },
            } as unknown as User);
            employeeTwo = await userService.createUser({
                email: "employee2@tutaller.com",
                password: "employee123",
                contact: contactEmployeeOTwo?._id,
                userTypes: [UserTypesEnum.EMPLOYEE],
                roles: [employeeRole?._id as unknown as Types.ObjectId],
                permissions: [UserPermissionsEnum.WORKSHOPS_READ, UserPermissionsEnum.USERS_UPDATE],
                employeeProfile: {
                    workshops: [],
                    category: "Electrician",
                    speciality: "Electronics",
                    isEmployee: true,
                },
            } as unknown as User);
            // Clientes
            clientOne = await userService.createUser({
                email: "client1@tutaller.com",
                password: "client123",
                contact: contactClientOne?._id,
                userTypes: [UserTypesEnum.CLIENT],
                roles: [clientRole?._id as unknown as Types.ObjectId],
                permissions: [UserPermissionsEnum.WORKSHOPS_READ, UserPermissionsEnum.USERS_UPDATE],
                clientProfile: {
                    preferredWorkshops: [],
                    isClient: true,
                },
            } as unknown as User);
            clientTwo = await userService.createUser({
                email: "client2@tutaller.com",
                password: "client123",
                contact: contactClientTwo?._id,
                userTypes: [UserTypesEnum.CLIENT],
                roles: [clientRole?._id as unknown as Types.ObjectId],
                permissions: [UserPermissionsEnum.WORKSHOPS_READ, UserPermissionsEnum.USERS_UPDATE],
                clientProfile: {
                    preferredWorkshops: [],
                    isClient: true,
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
            );            await contactService.updateContact(
                contactClientTwo?._id as string,
                {
                    userId: clientTwo._id,
                } as Contact
            );
        }

        // Crear talleres
        if (workshops.length === 0) {
            console.log("Creating workshops...");
            // Obtener referencias a los usuarios y suscripciones creados
            const existingUsers = await userService.findUsers();
            const existingSubscriptions = await subscriptionService.findSubscriptions();
            
            console.log(`Found ${existingUsers.length} users and ${existingSubscriptions.length} subscriptions`);
            
            const workshopAdminUser = existingUsers.find(user => user.email === "workshopadmin@tutaller.com");
            const employeeOneUser = existingUsers.find(user => user.email === "employee1@tutaller.com");
            const employeeTwoUser = existingUsers.find(user => user.email === "employee2@tutaller.com");
            const clientOneUser = existingUsers.find(user => user.email === "client1@tutaller.com");
            const clientTwoUser = existingUsers.find(user => user.email === "client2@tutaller.com");
            const freeDemoSub = existingSubscriptions.find(sub => sub.title === "FREE_DEMO");

            if (workshopAdminUser && freeDemoSub) {
                console.log("Creating workshop with admin and subscription...");
                // Crear contacto para el taller
                const contactWorkshop = await contactService.createContact({
                    name: "TuTaller",
                    surname: "Principal",
                    phone: "555-0123",
                    address: "Calle Principal 456",
                    state: "Estado Principal",
                    city: "Ciudad Principal",
                    postalCode: "67890",
                    country: "País Principal",
                } as Contact);

                // Crear el workshop
                workshop = await workshopService.createWorkshop({
                    name: "TuTaller Principal",
                    contact: contactWorkshop?._id,
                    status: ActivationStatus.ACTIVE,
                    subscription: freeDemoSub._id,
                    workshopAdmin: workshopAdminUser._id,
                    employees: employeeOneUser && employeeTwoUser ? [employeeOneUser._id, employeeTwoUser._id] : [],
                    clients: clientOneUser && clientTwoUser ? [clientOneUser._id, clientTwoUser._id] : [],
                } as Workshop);

                // Actualizar el contacto del workshop con el workshop ID
                await contactService.updateContact(
                    contactWorkshop?._id as string,
                    {
                        workshopId: workshop._id,
                    } as Contact
                );

                // Actualizar los usuarios para asignarlos al workshop
                await userService.updateUser(workshopAdminUser._id as string, {
                    workshopAdminProfile: {
                        managedWorkshops: [workshop._id],
                        isWorkshopAdmin: true,
                    }
                } as Partial<User>);

                if (employeeOneUser) {
                    await userService.updateUser(employeeOneUser._id as string, {
                        employeeProfile: {
                            workshops: [workshop._id],
                            category: "Mechanic",
                            speciality: "Engine",
                            isEmployee: true,
                        }
                    } as Partial<User>);
                }

                if (employeeTwoUser) {
                    await userService.updateUser(employeeTwoUser._id as string, {
                        employeeProfile: {
                            workshops: [workshop._id],
                            category: "Electrician",
                            speciality: "Electronics",
                            isEmployee: true,
                        }
                    } as Partial<User>);
                }

                if (clientOneUser) {
                    await userService.updateUser(clientOneUser._id as string, {
                        clientProfile: {
                            preferredWorkshops: [workshop._id],
                            isClient: true,
                        }
                    } as Partial<User>);
                }

                if (clientTwoUser) {
                    await userService.updateUser(clientTwoUser._id as string, {
                        clientProfile: {
                            preferredWorkshops: [workshop._id],
                            isClient: true,
                        }
                    } as Partial<User>);
                }

                console.log("Workshop created successfully");
            } else {
                console.log("Cannot create workshop - missing workshopAdmin or subscription", {
                    hasWorkshopAdmin: !!workshopAdminUser,
                    hasSubscription: !!freeDemoSub
                });
            }
        } else {
            console.log(`Workshops already exist: ${workshops.length} found`);
        }

        // Crear órdenes de reparación
        if (reparationOrders.length === 0) {
            console.log("Creating reparation orders...");
            // Obtener el workshop creado
            const existingWorkshops = await workshopService.findWorkshops();
            const workshopPrincipal = existingWorkshops.find(ws => ws.name === "TuTaller Principal");
            
            console.log(`Found ${existingWorkshops.length} workshops`);

            if (workshopPrincipal) {
                // Crear primera orden de reparación
                reparationOrderOne = await reparationOrderService.createReparationOrder({
                    name: "Reparación Completa Motor",
                    description: "Reparación completa del motor incluyendo cambio de aceite, filtros y revisión general",
                    workshop: workshopPrincipal._id,
                } as ReparationOrder);

                // Crear segunda orden de reparación
                reparationOrderTwo = await reparationOrderService.createReparationOrder({
                    name: "Mantenimiento Sistema Eléctrico",
                    description: "Revisión y mantenimiento completo del sistema eléctrico del vehículo, incluye batería y alternador",
                    workshop: workshopPrincipal._id,
                } as ReparationOrder);

                console.log("Reparation Orders created successfully");
            } else {
                console.log("Cannot create reparation orders - workshop not found");
            }
        } else {
            console.log(`Reparation orders already exist: ${reparationOrders.length} found`);
        }

        // Crear tareas de reparación
        if (reparationTasks.length === 0) {
            console.log("Creating reparation tasks...");
            // Obtener el workshop y las órdenes creadas
            const existingWorkshops = await workshopService.findWorkshops();
            const existingReparationOrders = await reparationOrderService.findReparationOrders();
            
            console.log(`Found ${existingWorkshops.length} workshops and ${existingReparationOrders.length} reparation orders`);
            
            const workshopPrincipal = existingWorkshops.find(ws => ws.name === "TuTaller Principal");
            const motorOrder = existingReparationOrders.find(ro => ro.name === "Reparación Completa Motor");
            const electricOrder = existingReparationOrders.find(ro => ro.name === "Mantenimiento Sistema Eléctrico");

            if (workshopPrincipal && motorOrder && electricOrder) {
                // Crear primera tarea de reparación
                reparationTaskOne = await reparationTaskService.createReparationTask({
                    name: "Cambio de Aceite",
                    description: "Cambio completo de aceite del motor y filtro",
                    reparationOrders: [motorOrder._id],
                    status: "pending",
                    workshop: workshopPrincipal._id,
                } as ReparationTask);

                // Crear segunda tarea de reparación
                reparationTaskTwo = await reparationTaskService.createReparationTask({
                    name: "Revisión de Batería",
                    description: "Revisión completa del estado de la batería y terminales",
                    reparationOrders: [electricOrder._id],
                    status: "in_progress",
                    startDate: new Date(),
                    workshop: workshopPrincipal._id,
                } as ReparationTask);

                // Crear tercera tarea de reparación (compartida entre ambas órdenes)
                reparationTaskThree = await reparationTaskService.createReparationTask({
                    name: "Inspección General",
                    description: "Inspección general del vehículo antes de iniciar trabajos",
                    reparationOrders: [motorOrder._id, electricOrder._id],
                    status: "completed",
                    startDate: new Date(Date.now() - 86400000), // Ayer
                    endDate: new Date(),
                    workshop: workshopPrincipal._id,
                } as ReparationTask);

                // Actualizar las reparationOrders con las reparationTasks asociadas
                await reparationOrderService.updateReparationOrder(motorOrder._id as string, {
                    reparationTasks: [reparationTaskOne._id, reparationTaskThree._id]
                } as Partial<ReparationOrder>);

                await reparationOrderService.updateReparationOrder(electricOrder._id as string, {
                    reparationTasks: [reparationTaskTwo._id, reparationTaskThree._id]
                } as Partial<ReparationOrder>);

                console.log("Reparation Tasks created successfully and associated with orders");
            } else {
                console.log("Cannot create reparation tasks - missing workshop or orders", {
                    hasWorkshop: !!workshopPrincipal,
                    hasMotorOrder: !!motorOrder,
                    hasElectricOrder: !!electricOrder
                });
            }
        } else {
            console.log(`Reparation tasks already exist: ${reparationTasks.length} found`);
        }

        console.log("Initial setup completed successfully");
    } catch (error) {
        console.error("Error in initial setup:", error);
    }
};
