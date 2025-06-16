import { StripePaymentModel } from "models/payments/stripePayment.model";
import { InterfaceStripePaymentRepository, StripePayment } from "types/payments/StripePaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class StripePaymentRepository implements InterfaceStripePaymentRepository {
    async create(data: StripePayment): Promise<StripePayment> {
        const newStripePayment = new StripePaymentModel(data);
        return await newStripePayment.save();
    }

    async find(query?: Query, params?: Params): Promise<StripePayment[]> {
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
        const stripePayments = await StripePaymentModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return stripePayments;
    }

    async countStripePayments(query?: Query): Promise<number> {
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
        const total = await StripePaymentModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<StripePayment | null> {
        return await StripePaymentModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<StripePayment | null> {
        return await StripePaymentModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: StripePayment): Promise<StripePayment | null> {
        return await StripePaymentModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, stripePaymentId: string): Promise<boolean> {
        const result = await StripePaymentModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: stripePaymentId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<StripePayment | null> {
        return await StripePaymentModel.findOneAndUpdate(
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
