import { RolesModel } from "models/roles.model";
import { Query } from "types/RepositoryTypes";
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";


export class RolesRepository implements InterfaceRolesRepository {

    async create(data: Roles): Promise<Roles> {
        const newRoles = new RolesModel(data)
        return await newRoles.save();
    }

    async find(query?: Query): Promise<Roles[]> {
        return await RolesModel.find(query || {}).exec();
    }

    async findById(id: string): Promise<Roles | null> {
        return await RolesModel.findById(id).exec();
    }

    async update(id: string, data: Roles): Promise<Roles | null> {
        return await RolesModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    
    async delete(id: string): Promise<boolean> {
        const deleted = await RolesModel.findByIdAndDelete(id).exec();
        return deleted !== null;
    }
}
