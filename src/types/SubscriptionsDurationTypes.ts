import { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";

export interface SubscriptionDuration extends Document{
    title: string;
    createdAt: Date;
    updatedAt: Date;
    expirationDate: Date;
}
export interface InterfaceSubscriptionDurationRepository extends Repository<SubscriptionDuration>{
    countSubscriptionDurations(query?: Query): Promise<number>;
    findOne(query: Query): Promise<SubscriptionDuration | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
}

export interface InterfaceSubscriptionDurationService {
    createSubscriptionDuration(subscriptionDuration: SubscriptionDuration): Promise<SubscriptionDuration>;
    findSubscriptionDurations(query?: Query, params?: Params): Promise<SubscriptionDuration[]>;
    findSubscriptionDurationById(id: string): Promise<SubscriptionDuration | null>;
    findSubscriptionDurationByTitle(title: string): Promise<SubscriptionDuration | null>;
    updateSubscriptionDuration(id: string, subscriptionDuration: Partial<SubscriptionDuration>): Promise<SubscriptionDuration | null>;
    deleteSubscriptionDuration(id: string): Promise<boolean>;
}