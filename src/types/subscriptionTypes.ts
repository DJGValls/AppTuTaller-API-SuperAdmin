import { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";

export interface Subscription extends Document{
    title: string;
    maxEmployees: number;
    description: string;
    price: number;
    durationType: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface InterfaceSubscriptionRepository extends Repository<Subscription>{
    countSubscriptions(query?: Query): Promise<number>;
    findOne(query: Query): Promise<Subscription | null>; // Para buscar cualquier usuario por un valor, ya sea name, firstName, email etc...
}

export interface InterfaceSubscriptionService {
    createSubscription(subscription: Subscription): Promise<Subscription>;
    findSubscriptions(query?: Query, params?: Params): Promise<Subscription[]>;
    findSubscriptionById(id: string): Promise<Subscription | null>;
    findSubscriptionByTitle(title: string): Promise<Subscription | null>;
    updateSubscription(id: string, subscription: Partial<Subscription>): Promise<Subscription | null>;
    deleteSubscription(id: string): Promise<boolean>;
}