import mongoose from "mongoose";
import { Query, Repository } from "../RepositoryTypes";
import { PaymentMethodEnum } from "enums/PaymentMethods.enums";
// Base PaymentMethod interface
export interface PaymentMethod extends Document {
    workshop: mongoose.Types.ObjectId;
    type: PaymentMethodEnum;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
// Repository interface for PaymentMethod
export interface InterfacePaymentMethodRepository extends Repository<PaymentMethod> {
    countPaymentMethods(query?: Query): Promise<number>;
    findOne(query: Query): Promise<PaymentMethod | null>;
    restore(id: string): Promise<PaymentMethod | null>;
}
// Service interface for PaymentMethod
export interface InterfacePaymentMethodService {
    createPaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
    findPaymentMethods(query?: Query): Promise<PaymentMethod[]>;
    findPaymentMethodById(id: string): Promise<PaymentMethod | null>;
    updatePaymentMethod(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null>;
    deletePaymentMethod(id: string, userId: string): Promise<boolean>;
    restorePaymentMethod(id: string): Promise<PaymentMethod | null>;
}