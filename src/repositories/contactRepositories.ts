import { ContactModel } from "models/contact.model";
import { Contact, InterfaceContactRepository } from "types/ContactTypes";
import { Params, Query } from "types/RepositoryTypes";

export class ContactRepository implements InterfaceContactRepository {
    async create(data: Contact): Promise<Contact> {
        const newContact = new ContactModel(data);
        return await newContact.save();
    }

    async find(query?: Query, params?: Params): Promise<Contact[]> {
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
        const contacts = await ContactModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();

        return contacts;
    }

    async countContacts(query?: Query): Promise<number> {
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
        const total = await ContactModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<Contact | null> {
        return await ContactModel.findOne({ _id: id, deletedAt: null }).exec();
    }

    async findOne(query: any): Promise<Contact | null> {
        return await ContactModel.findOne({ ...query, deletedAt: null }).exec();
    }

    async update(id: string, data: Contact): Promise<Contact | null> {
        return await ContactModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true }).exec();
    }

    async delete(id: string, contactId: string): Promise<boolean> {
        const result = await ContactModel.findOneAndUpdate(
            { _id: id, deletedAt: null },
            {
                deletedAt: new Date(),
                deletedBy: contactId,
            },
            { new: true }
        ).exec();
        return result !== null;
    }

    async restore(id: string): Promise<Contact | null> {
        return await ContactModel.findOneAndUpdate(
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
