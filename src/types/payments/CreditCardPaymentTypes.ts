import mongoose from "mongoose";
import { Query, Repository } from "../RepositoryTypes";

export interface CreditCardPayment {
    cardNumber: string;
    expirationDate: Date;
    cvv: string;
    cardHolderName: string;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfaceCreditCardPaymentRepository extends Repository<CreditCardPayment> {
    countCreditCardPayments(query?: Query): Promise<number>;
    findOne(query: Query): Promise<CreditCardPayment | null>;
    restore(id: string): Promise<CreditCardPayment | null>;
}

export interface InterfaceCreditCardPaymentService {
    createCreditCardPayment(creditCardPayment: CreditCardPayment): Promise<CreditCardPayment>;
    findCreditCardPayments(query?: Query): Promise<CreditCardPayment[]>;
    findCreditCardPaymentById(id: string): Promise<CreditCardPayment | null>;
    updateCreditCardPayment(id: string, creditCardPayment: Partial<CreditCardPayment>): Promise<CreditCardPayment | null>;
    deleteCreditCardPayment(id: string, userId: string): Promise<boolean>;
    restoreCreditCardPayment(id: string): Promise<CreditCardPayment | null>;
}
