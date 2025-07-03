
import { ReparationOrderModel } from "models/reparationOrder.model";
import { InterfaceReparationOrderRepository, ReparationOrder } from "types/ReparationOrderTypes";
import { Params, Query } from "types/RepositoryTypes";

export class ReparationOrderRepository implements InterfaceReparationOrderRepository {
    async create(data: ReparationOrder): Promise<ReparationOrder> {
        const newReparationOrder = new ReparationOrderModel(data);
        return await newReparationOrder.save();
    }

    async find(query?: Query, params?: Params): Promise<ReparationOrder[]> {
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
        const reparationOrders = await ReparationOrderModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return reparationOrders;
    }

    async countReparationOrders(query?: Query): Promise<number> {
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
        const total = await ReparationOrderModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<ReparationOrder | null> {
        return await ReparationOrderModel.findOne({ _id: id, deletedAt: null })
            .populate(["workshop", "reparationTasks", "deletedBy"])
            .exec();
    }

    async findOne(query: any): Promise<ReparationOrder | null> {
        return await ReparationOrderModel.findOne({ ...query, deletedAt: null })
            .populate(["workshop", "reparationTasks", "deletedBy"])
            .exec();
    }

    async update(id: string, data: ReparationOrder): Promise<ReparationOrder | null> {
        return await ReparationOrderModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true })
            .populate(["workshop", "reparationTasks", "deletedBy"])
            .exec();
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await ReparationOrderModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: userId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<ReparationOrder | null> {
        return await ReparationOrderModel.findOneAndUpdate(
            { _id: id, deletedAt: { $ne: null } },
            {
                $unset: {
                    deletedAt: "",
                    deletedBy: "",
                },
            },
            { new: true }
        )
            .populate(["workshop", "reparationTasks"])
            .exec();
    }
}
