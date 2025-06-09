import mongoose, { Document } from "mongoose";
import { Query, Repository } from "./RepositoryTypes";

export interface Roles extends Document {
    name: string;
    permissions: string[];
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfaceRolesRepository extends Repository<Roles> {
    countRoles(query?: Query): Promise<number>;
    findOne(query: Query): Promise<Roles | null>;
    restore(id: string): Promise<Roles | null>;
}

export interface InterfaceRolesService {
    createRoles(roles: Roles): Promise<Roles>;
    findRoles(query?: Query): Promise<Roles[]>;
    findRolesById(id: string): Promise<Roles | null>;
    updateRoles(id: string, roles: Partial<Roles>): Promise<Roles | null>;
    deleteRoles(id: string, userId: string): Promise<boolean>;
    restoreRoles(id: string): Promise<Roles | null>;
}
