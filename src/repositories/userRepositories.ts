import { UserModel } from "models/user.model";
import { PaginatedResponse, PaginationOptions, Query, SortOptions } from "types/RepositoryTypes";
import { InterfaceUserRepository, User } from "types/UserTypes";

export class UserRepository implements InterfaceUserRepository {
    async create(data: User): Promise<User> {
        const newUser = new UserModel(data);
        return await newUser.save();
    }

    async find(
        query?: Query,
        sort?: SortOptions,
        pagination?: PaginationOptions,
        populate?: string[]
    ): Promise<PaginatedResponse<User>> {
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;

        const queryBuilder = UserModel.find(query || {});

        if (sort && Object.keys(sort).length > 0) {
            queryBuilder.sort(sort);
        }
        // Aplicar populate si se proporciona
        if (populate && populate.length > 0) {
            populate.forEach((path) => {
                queryBuilder.populate(path);
            });
        }
        const total = await UserModel.countDocuments(query || {});
        const items = await queryBuilder.skip(skip).limit(limit).exec();
        return {
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string): Promise<User | null> {
        return await UserModel.findById(id).populate("roles").exec();
    }

    async findOne(query: any): Promise<User | null> {
        return await UserModel.findOne(query).populate("roles").exec();
    }

    async update(id: string, data: User): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true }).populate("roles").exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(id).exec();
        return deleted !== null;
    }
}
