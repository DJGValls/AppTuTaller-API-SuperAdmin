import { Params, Query } from "types/RepositoryTypes";
import { InterfaceSubscriptionDurationRepository, InterfaceSubscriptionDurationService, SubscriptionDuration } from "types/SubscriptionsDurationTypes";

export class SubscriptionDurationService implements InterfaceSubscriptionDurationService {
    private subscriptionDurationRepository: InterfaceSubscriptionDurationRepository;

    constructor(subscriptionDurationRepository: InterfaceSubscriptionDurationRepository) {
        this.subscriptionDurationRepository = subscriptionDurationRepository;
    }

    async createSubscriptionDuration(subscriptionDuration: SubscriptionDuration): Promise<SubscriptionDuration> {
        return await this.subscriptionDurationRepository.create(subscriptionDuration);
    }
    async findSubscriptionDurations(query?: Query, params?: Params): Promise<SubscriptionDuration[]> {
        const result = await this.subscriptionDurationRepository.find(query, params);
        return result;
    }
    async countSubscriptionDurations(query?: Query): Promise<number> {
        return await this.subscriptionDurationRepository.countSubscriptionDurations(query);
    }
    async findSubscriptionDurationById(id: string): Promise<SubscriptionDuration | null> {
        return await this.subscriptionDurationRepository.findById(id);
    }
    async findSubscriptionDurationByTitle(title: string): Promise<SubscriptionDuration | null> {
        return await this.subscriptionDurationRepository.findOne({ title });
    }
    async updateSubscriptionDuration(id: string, subscriptionDuration: Partial<SubscriptionDuration>): Promise<SubscriptionDuration | null> {
        return await this.subscriptionDurationRepository.update(id, subscriptionDuration);
    }
    async deleteSubscriptionDuration(id: string): Promise<boolean> {
        const subscriptionDuration = await this.subscriptionDurationRepository.delete(id);
        return subscriptionDuration ?? false;
    }



}
