import { SubscriptionModel } from "models/subscription.model";
import { Params, Query } from "types/RepositoryTypes";
import { InterfaceSubscriptionRepository, Subscription } from "../types/SubscriptionTypes";

export class SubscriptionRepository implements InterfaceSubscriptionRepository {
    async create(data: Subscription): Promise<Subscription> {
        const newSubscription = new SubscriptionModel(data);
        return await newSubscription.save();
    }

    async find(query?: Query, params?: Params): Promise<Subscription[]> {
        const sortQuery = params?.sort ? params.sort : {};
        const populateQuery = params?.populate ? params.populate : [];
        const page = params?.page ? Number(params.page) : 1;
        const perPage = params?.perPage ? Number(params.perPage) : 10;
        const skip = (page - 1) * perPage;
        let mongoQuery: any = {};
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value) {
                    if (typeof value === 'string') {
                        // Búsqueda case-insensitive con regex para strings
                        mongoQuery[key] = { $regex: value, $options: 'i' };
                    } else {
                        mongoQuery[key] = value;
                    }
                }
            });
        }
        const subscriptions = await SubscriptionModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();
        
        return subscriptions;
    }

    async countSubscriptions(query?: Query): Promise<number> {
        let mongoQuery: any = {};
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value) {
                    if (typeof value === 'string') {
                        mongoQuery[key] = { $regex: value, $options: 'i' };
                    } else {
                        mongoQuery[key] = value;
                    }
                }
            });
        }
        const total = await SubscriptionModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<Subscription | null> {
        return await SubscriptionModel.findById(id).populate("subscriptionTypes").exec();
    }

    async findOne(query: any): Promise<Subscription | null> {
        return await SubscriptionModel.findOne(query).populate("subscriptionTypes").exec();
    }

    async update(id: string, data: Subscription): Promise<Subscription | null> {
        return await SubscriptionModel.findByIdAndUpdate(id, data, { new: true }).populate("subscriptionTypes").exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await SubscriptionModel.findByIdAndDelete(id).exec();
        return deleted !== null;
    }
}
