
import { CreditCardPaymentModel } from "models/payments/creditCardPayment.model";
import { CreditCardPayment, InterfaceCreditCardPaymentRepository } from "types/payments/CreditCardPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class CreditCardPaymentRepository implements InterfaceCreditCardPaymentRepository {
    async create(data: CreditCardPayment): Promise<CreditCardPayment> {
        const newCreditCardPayment = new CreditCardPaymentModel(data);
        return await newCreditCardPayment.save();
    }

    async find(query?: Query, params?: Params): Promise<CreditCardPayment[]> {
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
        const creditCardPayments = await CreditCardPaymentModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return creditCardPayments;
    }

    async countCreditCardPayments(query?: Query): Promise<number> {
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
        const total = await CreditCardPaymentModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<CreditCardPayment | null> {
        return await CreditCardPaymentModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<CreditCardPayment | null> {
        return await CreditCardPaymentModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: CreditCardPayment): Promise<CreditCardPayment | null> {
        return await CreditCardPaymentModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, creditCardPaymentId: string): Promise<boolean> {
        const result = await CreditCardPaymentModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: creditCardPaymentId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<CreditCardPayment | null> {
        return await CreditCardPaymentModel.findOneAndUpdate(
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
