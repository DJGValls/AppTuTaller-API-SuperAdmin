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
        if (roles.items.length > 0 && users.items.length > 0) return;
        // Crear roles iniciales
        const adminRole = await rolesService.createRoles({
            name: "admin",
            permissions: ["admin_granted"],
        } as Roles);
        const managerRole = await rolesService.createRoles({
            name: "manager",
            permissions: ["users_read", "users_update", "users_create", "users_delete"],
        } as Roles);
        const userRole = await rolesService.createRoles({
            name: "user",
            permissions: ["users_read", "users_update"],
        } as Roles);
        // Crear usuarios iniciales
        await userService.createUser({
            name: "Admin",
            firstName: "Admin",
            lastName: "User",
            email: "admin@admin.com",
            password: "admin123",
            phone: "000000000",
            roles: [adminRole._id],
            permissions: adminRole.permissions,
        } as User);
        await userService.createUser({
            name: "Manager",
            firstName: "Manager",
            lastName: "User",
            email: "manager@manager.com",
            password: "manager123",
            phone: "000000000",
            roles: [managerRole._id],
            permissions: managerRole.permissions,
        } as User);
        await userService.createUser({
            name: "User",
            firstName: "Normal",
            lastName: "User",
            email: "user@user.com",
            password: "user123",
            phone: "000000000",
            roles: [userRole._id],
            permissions: userRole.permissions,
        } as User);
        console.log("Initial setup completed successfully");
    } catch (error) {
        console.error("Error in initial setup:", error);
    }
};
