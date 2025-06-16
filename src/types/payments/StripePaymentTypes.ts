import mongoose from "mongoose";
import { Query, Repository } from "../RepositoryTypes";
export interface StripePayment {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeProductId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    status: string;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
export interface InterfaceStripePaymentRepository extends Repository<StripePayment> {
    countStripePayments(query?: Query): Promise<number>;
    findOne(query: Query): Promise<StripePayment | null>;
    restore(id: string): Promise<StripePayment | null>;
}
export interface InterfaceStripePaymentService {
    createStripePayment(stripePayment: StripePayment): Promise<StripePayment>;
    findStripePayments(query?: Query): Promise<StripePayment[]>;
    findStripePaymentById(id: string): Promise<StripePayment | null>;
    updateStripePayment(id: string, stripePayment: Partial<StripePayment>): Promise<StripePayment | null>;
    deleteStripePayment(id: string, userId: string): Promise<boolean>;
    restoreStripePayment(id: string): Promise<StripePayment | null>;
}