import { Params, Query } from "types/RepositoryTypes";
import { InterfaceRolesRepository, InterfaceRolesService, Roles } from "types/RolesTypes";

export class RolesService implements InterfaceRolesService {
    private rolesRepository: InterfaceRolesRepository;

    constructor(rolesRepository: InterfaceRolesRepository) {
        this.rolesRepository = rolesRepository;
    }

    async createRoles(roles: Roles): Promise<Roles> {
        return await this.rolesRepository.create(roles);
    }
    async findRoles(query?: Query, params?: Params): Promise<Roles[]> {
        return await this.rolesRepository.find(query, params);
    }
    async countRoles(query?: Query): Promise<number> {
        return await this.rolesRepository.countRoles(query);
    }
    async findRolesById(id: string): Promise<Roles | null> {
        return await this.rolesRepository.findById(id);
    }
    async updateRoles(id: string, roles: Partial<Roles>): Promise<Roles | null> {
        return await this.rolesRepository.update(id, roles);
    }
    async deleteRoles(id: string, rolesId?: string): Promise<boolean> {
        const roles = await this.rolesRepository.delete(id, rolesId);
        return roles ?? false;
    }
    async restoreRoles(id: string): Promise<Roles | null> {
        return await this.rolesRepository.restore(id);
    }
}
