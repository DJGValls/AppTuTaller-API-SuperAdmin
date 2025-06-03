import { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface User extends Document{
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    modifyBy?: string;
    createdBy?: string;
    deletedBy?: string;
    roles?: string[];
    permissions?: string[];
    comparePassword(password: string): Promise<boolean>;
}

export interface InterfaceUserRepository extends Repository<User>{
    findOne(query: Query): Promise<User | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
}

export interface InterfaceUserService {
    createUser(user: User): Promise<User>;
    findUsers(query?: Query): Promise<User[]>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(id: string, user: Partial<User>): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
}