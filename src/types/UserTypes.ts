import mongoose, { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";
import { UserTypesEnum } from "enums/UserTypes.enums";
import { Contact } from "./ContactTypes";

export interface User extends Document {
    email: string;
    password: string;
    contact: mongoose.Types.ObjectId | Contact | unknown; //los datos del contacto
    userTypes: UserTypesEnum[]; // Puede ser un usuario de varios tipos a la vez
    roles: mongoose.Types.ObjectId[]; // Puede tener varios roles segun los tipos de usuario contratado
    permissions: string[];
    // Para los talleres que el usuario administra
    workshopAdminProfile?: {
        isWorkshopAdmin?: boolean;
        managedWorkshops: mongoose.Types.ObjectId[];
    };
    // Para los talleres donde el usuario es empleado
    // Si es un empleado, el taller puede definir su categoria
    // Si es un empleado, el taller puede definir su especialidad
    employeeProfile?: {
        isEmployee?: boolean;
        workshops?: mongoose.Types.ObjectId[];
        category?: string;
        speciality?: string;
    };
    // Para los talleres donde el usuario es cliente
    clientProfile?: {
        isClient?: boolean;
        preferredWorkshops?: mongoose.Types.ObjectId[];
    };
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
    comparePassword(password: string): Promise<boolean>;
}

export interface InterfaceUserRepository extends Repository<User> {
    countUsers(query?: Query): Promise<number>;
    findOne(query: Query): Promise<User | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
    restore(id: string): Promise<User | null>;
}

export interface InterfaceUserService {
    createUser(user: User): Promise<User>;
    findUsers(query?: Query, params?: Params): Promise<User[]>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(id: string, user: Partial<User>): Promise<User | null>;
    deleteUser(id: string, userId?: string): Promise<boolean>;
    restoreUser(id: string): Promise<User | null>;
    countUsers(query?: Query): Promise<number>;
    calculateUserPermissions(roles: any[]): Promise<{ permissions: string[], invalidPermissions: string[] }>;
    createUserWithPermissions(userData: User, roles: any[]): Promise<{ user: User, warnings: string[] }>;
}
