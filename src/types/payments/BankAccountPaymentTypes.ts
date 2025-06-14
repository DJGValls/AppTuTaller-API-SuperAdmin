import mongoose from "mongoose";
import { Params, Query, Repository } from "../RepositoryTypes";

export interface BankAccountPayment {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    swiftCode: string;
    iban: string;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfaceBankAccountPaymentRepository extends Repository<BankAccountPayment> {
    countBankAccountPayments(query?: Query): Promise<number>;
    findOne(query: Query): Promise<BankAccountPayment | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
    restore(id: string): Promise<BankAccountPayment | null>;
}

export interface InterfaceBankAccountPaymentService {
    createBankAccountPayment(BankAccountPayment: BankAccountPayment): Promise<BankAccountPayment>;
    findBankAccountPayments(query?: Query, params?: Params): Promise<BankAccountPayment[]>;
    findBankAccountPaymentById(id: string): Promise<BankAccountPayment | null>;
    findBankAccountPaymentByBankName(bankName: string): Promise<BankAccountPayment | null>;
    updateBankAccountPayment(id: string, BankAccountPayment: Partial<BankAccountPayment>): Promise<BankAccountPayment | null>;
    deleteBankAccountPayment(id: string, BankAccountPaymentId?: string): Promise<boolean>;
    restoreBankAccountPayment(id: string): Promise<BankAccountPayment | null>;
}