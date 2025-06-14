
import { BankAccountPaymentModel } from "models/payments/bankAccountPayment.model";
import { BankAccountPayment, InterfaceBankAccountPaymentRepository } from "types/payments/BankAccountPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class BankAccountPaymentRepository implements InterfaceBankAccountPaymentRepository {
    async create(data: BankAccountPayment): Promise<BankAccountPayment> {
        const newBankAccountPayment = new BankAccountPaymentModel(data);
        return await newBankAccountPayment.save();
    }

    async find(query?: Query, params?: Params): Promise<BankAccountPayment[]> {
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
        const bankAccountPayments = await BankAccountPaymentModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return bankAccountPayments;
    }

    async countBankAccountPayments(query?: Query): Promise<number> {
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
        const total = await BankAccountPaymentModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<BankAccountPayment | null> {
        return await BankAccountPaymentModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<BankAccountPayment | null> {
        return await BankAccountPaymentModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: BankAccountPayment): Promise<BankAccountPayment | null> {
        return await BankAccountPaymentModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, bankAccountPaymentId: string): Promise<boolean> {
        const result = await BankAccountPaymentModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: bankAccountPaymentId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<BankAccountPayment | null> {
        return await BankAccountPaymentModel.findOneAndUpdate(
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
