import { Document } from "mongoose";
import { PaginatedResponse, Query, Repository } from "./RepositoryTypes";

export interface Roles extends Document{
    name: string;
    permissions: string[];
}

export interface InterfaceRolesRepository extends Repository<Roles>{}

export interface InterfaceRolesService {
    createRoles(roles: Roles): Promise<Roles>;
    findRoles(query?: Query): Promise<PaginatedResponse<Roles>>;
    findRolesById(id: string): Promise<Roles | null>;
    updateRoles(id: string, roles: Partial<Roles>): Promise<Roles | null>;
    deleteRoles(id: string): Promise<boolean>;
}