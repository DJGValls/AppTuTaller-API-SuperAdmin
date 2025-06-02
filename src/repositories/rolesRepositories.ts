import { RolesModel } from "models/roles.model";
import { PaginatedResponse, PaginationOptions, Query, SortOptions } from "types/RepositoryTypes";
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";


export class RolesRepository implements InterfaceRolesRepository {

    async create(data: Roles): Promise<Roles> {
        const newRoles = new RolesModel(data)
        return await newRoles.save();
    }

    async find(query?: Query, sort?: SortOptions, pagination?: PaginationOptions): Promise<PaginatedResponse<Roles>> {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;
        const queryBuilder = RolesModel.find(query || {});
        if (sort && Object.keys(sort).length > 0) {
            queryBuilder.sort(sort);
        }
        const total = await RolesModel.countDocuments(query || {});
        const items = await queryBuilder.skip(skip).limit(limit).exec();
        return {
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
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
