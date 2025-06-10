import { Contact, InterfaceContactRepository, InterfaceContactService } from "types/ContactTypes";
import { Params, Query } from "types/RepositoryTypes";

export class ContactService implements InterfaceContactService {
    private contactRepository: InterfaceContactRepository;

    constructor(contactRepository: InterfaceContactRepository) {
        this.contactRepository = contactRepository;
    }

    async createContact(contact: Contact): Promise<Contact> {
        return await this.contactRepository.create(contact);
    }
    async findContacts(query?: Query, params?: Params): Promise<Contact[]> {
        const result = await this.contactRepository.find(query, params);
        return result;
    }
    async countContacts(query?: Query): Promise<number> {
        return await this.contactRepository.countContacts(query);
    }
    async findContactById(id: string): Promise<Contact | null> {
        return await this.contactRepository.findById(id);
    }
    async findContactByEmail(email: string): Promise<Contact | null> {
        return await this.contactRepository.findOne({ email });
    }
    async updateContact(id: string, contact: Partial<Contact>): Promise<Contact | null> {
        return await this.contactRepository.update(id, contact);
    }
    async deleteContact(id: string, contactId?: string): Promise<boolean> {
        const Contact = await this.contactRepository.delete(id, contactId);
        return Contact ?? false;
    }
    async restoreContact(id: string): Promise<Contact | null> {
        return await this.contactRepository.restore(id);
    }
}
