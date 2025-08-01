
import { SubscriptionDurationModel } from "models/subscriptionDuration.model";
import { Params, Query } from "types/RepositoryTypes";
import { InterfaceSubscriptionDurationRepository, SubscriptionDuration } from "types/SubscriptionsDurationTypes";
export class SubscriptionDurationRepository implements InterfaceSubscriptionDurationRepository {
    async create(data: SubscriptionDuration): Promise<SubscriptionDuration> {
        const newSubscriptionDuration = new SubscriptionDurationModel(data);
        return await newSubscriptionDuration.save();
    }

    async find(query?: Query, params?: Params): Promise<SubscriptionDuration[]> {
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
        const subscriptionDurations = await SubscriptionDurationModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();
        
        return subscriptionDurations;
    }

    async countSubscriptionDurations(query?: Query): Promise<number> {
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
        const total = await SubscriptionDurationModel.countDocuments(mongoQuery).exec();
        return total;
    }

    async findById(id: string): Promise<SubscriptionDuration | null> {
        return await SubscriptionDurationModel.findById(id).populate("").exec();
    }

    async findOne(query: any): Promise<SubscriptionDuration | null> {
        return await SubscriptionDurationModel.findOne(query).populate("").exec();
    }

    async update(id: string, data: SubscriptionDuration): Promise<SubscriptionDuration | null> {
        return await SubscriptionDurationModel.findByIdAndUpdate(id, data, { new: true }).populate("").exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await SubscriptionDurationModel.findByIdAndDelete(id).exec();
        return deleted !== null;
    }
}
