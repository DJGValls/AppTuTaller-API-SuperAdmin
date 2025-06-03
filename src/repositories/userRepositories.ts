import { UserModel } from "models/user.model";
import { Params, Query } from "types/RepositoryTypes";
import { InterfaceUserRepository, User } from "types/UserTypes";

export class UserRepository implements InterfaceUserRepository {
    async create(data: User): Promise<User> {
        const newUser = new UserModel(data);
        return await newUser.save();
    }

    async find(query?: Query, params?: Params): Promise<User[]> {
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
        const users = await UserModel.find(mongoQuery)
            .sort(sortQuery)
            .populate(populateQuery)
            .skip(skip)
            .limit(perPage)
            .exec();
        
        return users;
    }

    async countUsers(query?: Query): Promise<number> {
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
        const total = await UserModel.countDocuments(mongoQuery).exec();
        return total;
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
