import { RolesModel } from "models/roles.model";
import { Params, Query } from "types/RepositoryTypes";
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";

export class RolesRepository implements InterfaceRolesRepository {
    async create(data: Roles): Promise<Roles> {
        const newRoles = new RolesModel(data);
        return await newRoles.save();
    }

    async find(query?: Query, params?: Params): Promise<Roles[]> {
        const sortQuery = params?.sort ? params.sort : {};
        const populateQuery = params?.populate ? params.populate : [];
        const page = params?.page ? Number(params.page) : 1;
        const perPage = params?.perPage ? Number(params.perPage) : 10;
        const skip = (page - 1) * perPage;
        let mongoQuery: any = { deletedAt: null }; // Excluir registros eliminados
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value) {
                    if (typeof value === "string") {
                        // Búsqueda case-insensitive con regex para strings
                        mongoQuery[key] = { $regex: value, $options: "i" };
                    } else {
                        mongoQuery[key] = value;
                    }
                }
            });
        }
        const roles = await RolesModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return roles;
    }

    async countRoles(query?: Query): Promise<number> {
        let mongoQuery: any = { deletedAt: null }; // Excluir registros eliminados
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value) {
                    if (typeof value === "string") {
                        mongoQuery[key] = { $regex: value, $options: "i" };
                    } else {
                        mongoQuery[key] = value;
                    }
                }
            });
        }
        const total = await RolesModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<Roles | null> {
        return await RolesModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<Roles | null> {
        return await RolesModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: Roles): Promise<Roles | null> {
        return await RolesModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await RolesModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: userId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<Roles | null> {
        return await RolesModel.findOneAndUpdate(
            { _id: id, deletedAt: { $ne: null } },
            {
                $unset: {
                    deletedAt: "",
                    deletedBy: "",
                },
            },
            { new: true }
        )
            .populate("")
            .exec();
    }
}
