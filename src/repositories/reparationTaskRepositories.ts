import { ReparationTaskModel } from "models/reparationTask.model";
import { InterfaceReparationTaskRepository, ReparationTask } from "types/ReparationTaskTypes";
import { Params, Query } from "types/RepositoryTypes";

export class ReparationTaskRepository implements InterfaceReparationTaskRepository {
    async create(data: ReparationTask): Promise<ReparationTask> {
        const newReparationTask = new ReparationTaskModel(data);
        return await newReparationTask.save();
    }

    async find(query?: Query, params?: Params): Promise<ReparationTask[]> {
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
        
        const reparationTasks = await ReparationTaskModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return reparationTasks;
    }

    async countReparationTasks(query?: Query): Promise<number> {
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
        
        const total = await ReparationTaskModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<ReparationTask | null> {
        return await ReparationTaskModel.findOne({ _id: id, deletedAt: null })
            .populate(["reparationOrders", "workshop", "deletedBy"])
            .exec();
    }

    async findOne(query: any): Promise<ReparationTask | null> {
        return await ReparationTaskModel.findOne({ ...query, deletedAt: null })
            .populate(["reparationOrders", "workshop", "deletedBy"])
            .exec();
    }

    async update(id: string, data: ReparationTask): Promise<ReparationTask | null> {
        return await ReparationTaskModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true })
            .populate(["reparationOrders", "workshop", "deletedBy"])
            .exec();
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await ReparationTaskModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: userId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<ReparationTask | null> {
        return await ReparationTaskModel.findOneAndUpdate(
            { _id: id, deletedAt: { $ne: null } },
            {
                $unset: {
                    deletedAt: "",
                    deletedBy: "",
                },
            },
            { new: true }
        )
            .populate(["reparationOrders", "workshop"])
            .exec();
    }
}
