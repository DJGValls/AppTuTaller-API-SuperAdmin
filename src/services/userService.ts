import { Params, Query } from "types/RepositoryTypes";
import { InterfaceUserRepository, InterfaceUserService, User } from "../types/UserTypes";
import { validatePermissions } from "enums/UserPermissions.enums";
import { Roles } from "types/RolesTypes";

export class UserService implements InterfaceUserService {
    private userRepository: InterfaceUserRepository;

    constructor(userRepository: InterfaceUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepository.create(user);
    }
    async findUsers(query?: Query, params?: Params): Promise<User[]> {
        const result = await this.userRepository.find(query, params);
        return result;
    }
    async countUsers(query?: Query): Promise<number> {
        return await this.userRepository.countUsers(query);
    }
    async findUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ email });
    }
    async updateUser(id: string, user: Partial<User>): Promise<User | null> {
        return await this.userRepository.update(id, user);
    }
    async deleteUser(id: string, userId?: string): Promise<boolean> {
        const user = await this.userRepository.delete(id, userId);
        return user ?? false;
    }
    async restoreUser(id: string): Promise<User | null> {
        return await this.userRepository.restore(id);
    }

    /**
     * Calcula y valida los permisos basados en los roles del usuario
     */
    async calculateUserPermissions(roles: Roles[]): Promise<{ permissions: string[], invalidPermissions: string[] }> {
        // Obtener todos los permisos de los roles
        const allPermissions = roles.reduce((permissions: string[], role) => {
            return [...permissions, ...role.permissions];
        }, []);

        // Eliminar duplicados
        const uniquePermissions = [...new Set(allPermissions)];

        // Validar permisos
        const { valid, invalid } = validatePermissions(uniquePermissions);

        return {
            permissions: valid,
            invalidPermissions: invalid
        };
    }

    /**
     * Crea un usuario con validación de permisos
     */
    async createUserWithPermissions(userData: User, roles: Roles[]): Promise<{ user: User, warnings: string[] }> {
        const warnings: string[] = [];
        
        // Calcular permisos basados en roles
        const { permissions, invalidPermissions } = await this.calculateUserPermissions(roles);
        
        // Agregar advertencias por permisos inválidos
        if (invalidPermissions.length > 0) {
            warnings.push(`Permisos inválidos ignorados: ${invalidPermissions.join(', ')}`);
        }

        // Asignar permisos válidos al usuario
        userData.permissions = permissions;

        // Crear el usuario
        const user = await this.userRepository.create(userData);
        
        return { user, warnings };
    }
}
