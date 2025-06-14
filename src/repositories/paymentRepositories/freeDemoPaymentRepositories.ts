
import { FreeDemoPaymentModel } from "models/payments/freeDemoPayment.model";
import { FreeDemoPayment, InterfaceFreeDemoPaymentRepository } from "types/payments/FreeDemoPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class FreeDemoPaymentRepository implements InterfaceFreeDemoPaymentRepository {
    async create(data: FreeDemoPayment): Promise<FreeDemoPayment> {
        const newFreeDemoPayment = new FreeDemoPaymentModel(data);
        return await newFreeDemoPayment.save();
    }

    async find(query?: Query, params?: Params): Promise<FreeDemoPayment[]> {
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
        const freeDemoPayments = await FreeDemoPaymentModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return freeDemoPayments;
    }

    async countFreeDemoPayments(query?: Query): Promise<number> {
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
        const total = await FreeDemoPaymentModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<FreeDemoPayment | null> {
        return await FreeDemoPaymentModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<FreeDemoPayment | null> {
        return await FreeDemoPaymentModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: FreeDemoPayment): Promise<FreeDemoPayment | null> {
        return await FreeDemoPaymentModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, freeDemoPaymentId: string): Promise<boolean> {
        const result = await FreeDemoPaymentModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: freeDemoPaymentId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<FreeDemoPayment | null> {
        return await FreeDemoPaymentModel.findOneAndUpdate(
            { _id: id, deletedAt: { $ne: null } },
            {
                $unset: {
                    deletedAt: "",
                    deletedBy: "",
                },
            },
            { new: true }
        ).exec();
    }
}
