import mongoose, { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";

export interface SubscriptionDuration extends Document {
    title: string;
    durationInDays: number;
    isRecurring: boolean;
    billingCycle: "monthly" | "quarterly" | "yearly";
    expirationDate: Date;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
export interface InterfaceSubscriptionDurationRepository extends Repository<SubscriptionDuration> {
    countSubscriptionDurations(query?: Query): Promise<number>;
    findOne(query: Query): Promise<SubscriptionDuration | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
    restore(id: string): Promise<SubscriptionDuration | null>;
}

export interface InterfaceSubscriptionDurationService {
    createSubscriptionDuration(subscriptionDuration: SubscriptionDuration): Promise<SubscriptionDuration>;
    findSubscriptionDurations(query?: Query, params?: Params): Promise<SubscriptionDuration[]>;
    findSubscriptionDurationById(id: string): Promise<SubscriptionDuration | null>;
    findSubscriptionDurationByTitle(title: string): Promise<SubscriptionDuration | null>;
    updateSubscriptionDuration(
        id: string,
        subscriptionDuration: Partial<SubscriptionDuration>
    ): Promise<SubscriptionDuration | null>;
    deleteSubscriptionDuration(id: string, userId: string): Promise<boolean>;
    restoreSubscriptionDuration(id: string): Promise<SubscriptionDuration | null>;
}
