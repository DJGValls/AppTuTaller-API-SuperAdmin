
import { PaypalPaymentModel } from "models/payments/paypalPayment.model";
import { InterfacePaypalPaymentRepository, PaypalPayment } from "types/payments/PaypalPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class PaypalPaymentRepository implements InterfacePaypalPaymentRepository {
    async create(data: PaypalPayment): Promise<PaypalPayment> {
        const newPaypalPayment = new PaypalPaymentModel(data);
        return await newPaypalPayment.save();
    }

    async find(query?: Query, params?: Params): Promise<PaypalPayment[]> {
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
        const paypalPayments = await PaypalPaymentModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return paypalPayments;
    }

    async countPaypalPayments(query?: Query): Promise<number> {
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
        const total = await PaypalPaymentModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<PaypalPayment | null> {
        return await PaypalPaymentModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<PaypalPayment | null> {
        return await PaypalPaymentModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: PaypalPayment): Promise<PaypalPayment | null> {
        return await PaypalPaymentModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, paypalPaymentId: string): Promise<boolean> {
        const result = await PaypalPaymentModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: paypalPaymentId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<PaypalPayment | null> {
        return await PaypalPaymentModel.findOneAndUpdate(
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
