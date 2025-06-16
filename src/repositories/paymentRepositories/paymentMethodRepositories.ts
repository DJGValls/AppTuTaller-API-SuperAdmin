
import { PaymentMethodModel } from "models/payments/paymentMethod.model";
import { InterfacePaymentMethodRepository, PaymentMethod } from "types/payments/PaymentMethodTypes";
import { Params, Query } from "types/RepositoryTypes";

export class PaymentMethodRepository implements InterfacePaymentMethodRepository {
    async create(data: PaymentMethod): Promise<PaymentMethod> {
        const newPaymentMethod = new PaymentMethodModel(data);
        return await newPaymentMethod.save();
    }

    async find(query?: Query, params?: Params): Promise<PaymentMethod[]> {
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
        const paymentMethods = await PaymentMethodModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return paymentMethods;
    }

    async countPaymentMethods(query?: Query): Promise<number> {
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
        const total = await PaymentMethodModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<PaymentMethod | null> {
        return await PaymentMethodModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<PaymentMethod | null> {
        return await PaymentMethodModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: PaymentMethod): Promise<PaymentMethod | null> {
        return await PaymentMethodModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, paymentMethodId: string): Promise<boolean> {
        const result = await PaymentMethodModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: paymentMethodId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<PaymentMethod | null> {
        return await PaymentMethodModel.findOneAndUpdate(
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
