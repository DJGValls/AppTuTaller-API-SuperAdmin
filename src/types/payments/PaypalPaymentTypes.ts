import mongoose from "mongoose";
import { Query, Repository } from "../RepositoryTypes";

export interface PaypalPayment {
    email: string;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfacePaypalPaymentRepository extends Repository<PaypalPayment> {
    countPaypalPayments(query?: Query): Promise<number>;
    findOne(query: Query): Promise<PaypalPayment | null>;
    restore(id: string): Promise<PaypalPayment | null>;
}

export interface InterfacePaypalPaymentService {
    createPaypalPayment(paypalPayment: PaypalPayment): Promise<PaypalPayment>;
    findPaypalPayments(query?: Query): Promise<PaypalPayment[]>;
    findPaypalPaymentById(id: string): Promise<PaypalPayment | null>;
    updatePaypalPayment(id: string, paypalPayment: Partial<PaypalPayment>): Promise<PaypalPayment | null>;
    deletePaypalPayment(id: string, userId: string): Promise<boolean>;
    restorePaypalPayment(id: string): Promise<PaypalPayment | null>;
}
