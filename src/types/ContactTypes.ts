import mongoose, { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";

export interface Contact extends Document {
    userId?: mongoose.Types.ObjectId | unknown;
    workshopId?: mongoose.Types.ObjectId | unknown;
    name: string;
    surname: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    postalCode: string;
    country: string;
    cif?: string;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfaceContactRepository extends Repository<Contact> {
    countContacts(query?: Query): Promise<number>;
    findOne(query: Query): Promise<Contact | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
    restore(id: string): Promise<Contact | null>;
}

export interface InterfaceContactService {
    createContact(contact: Contact): Promise<Contact>;
    findContacts(query?: Query, params?: Params): Promise<Contact[]>;
    findContactById(id: string): Promise<Contact | null>;
    findContactByEmail(email: string): Promise<Contact | null>;
    updateContact(id: string, contact: Partial<Contact>): Promise<Contact | null>;
    deleteContact(id: string, contactId?: string): Promise<boolean>;
    restoreContact(id: string): Promise<Contact | null>;
}
