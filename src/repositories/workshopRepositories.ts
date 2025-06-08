import { WorkshopModel } from "models/workshop.model";
import { Params, Query } from "types/RepositoryTypes";
import { InterfaceWorkshopRepository, Workshop } from "types/WorkshopTypes";

export class WorkshopRepository implements InterfaceWorkshopRepository {
    async create(data: Workshop): Promise<Workshop> {
        const newWorkshop = new WorkshopModel(data);
        return await newWorkshop.save();
    }

    async find(query?: Query, params?: Params): Promise<Workshop[]> {
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
        const workshops = await WorkshopModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return workshops;
    }

    async countWorkshops(query?: Query): Promise<number> {
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
        const total = await WorkshopModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<Workshop | null> {
        return await WorkshopModel.findOne({ _id: id, deletedAt: null })
            .populate(["contact", "account", "subscription", "workshopAdmin", "employees", "deletedBy"])
            .exec();
    }

    async findOne(query: any): Promise<Workshop | null> {
        return await WorkshopModel.findOne({ ...query, deletedAt: null })
            .populate(["contact", "account", "subscription", "workshopAdmin", "employees", "deletedBy"])
            .exec();
    }

    async update(id: string, data: Workshop): Promise<Workshop | null> {
        return await WorkshopModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true })
            .populate(["contact", "account", "subscription", "workshopAdmin", "employees", "deletedBy"])
            .exec();
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await WorkshopModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: userId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }
    async restore(id: string): Promise<Workshop | null> {
        return await WorkshopModel.findOneAndUpdate(
            { _id: id, deletedAt: { $ne: null } },
            {
                $unset: {
                    deletedAt: "",
                    deletedBy: "",
                },
            },
            { new: true }
        )
            .populate(["contact", "account", "subscription", "workshopAdmin", "employees", "deletedBy"])
            .exec();
    }
}
