import { Params, Query } from "types/RepositoryTypes";
import { InterfaceSubscriptionRepository, InterfaceSubscriptionService, Subscription } from "types/SubscriptionsTypes";

export class SubscriptionService implements InterfaceSubscriptionService {
    private subscriptionRepository: InterfaceSubscriptionRepository;

    constructor(subscriptionRepository: InterfaceSubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    async createSubscription(subscription: Subscription): Promise<Subscription> {
        return await this.subscriptionRepository.create(subscription);
    }
    async findSubscriptions(query?: Query, params?: Params): Promise<Subscription[]> {
        const result = await this.subscriptionRepository.find(query, params);
        return result;
    }
    async countSubscriptions(query?: Query): Promise<number> {
        return await this.subscriptionRepository.countSubscriptions(query);
    }
    async findSubscriptionById(id: string): Promise<Subscription | null> {
        return await this.subscriptionRepository.findById(id);
    }
    async findSubscriptionByTitle(title: string): Promise<Subscription | null> {
        return await this.subscriptionRepository.findOne({ title });
    }
    async updateSubscription(id: string, subscription: Partial<Subscription>): Promise<Subscription | null> {
        return await this.subscriptionRepository.update(id, subscription);
    }
    async deleteSubscription(id: string): Promise<boolean> {
        const Subscription = await this.subscriptionRepository.delete(id);
        return Subscription ?? false;
    }



}
