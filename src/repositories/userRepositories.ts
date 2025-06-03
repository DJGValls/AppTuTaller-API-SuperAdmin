import { UserModel } from "models/user.model";
import { Query } from "types/RepositoryTypes";
import { InterfaceUserRepository, User } from "types/UserTypes";

export class UserRepository implements InterfaceUserRepository {

    async create(data: User): Promise<User> {
        const newUser = new UserModel(data)
        return await newUser.save();
    }

    async find(query?: Query): Promise<User[]> {
        return await UserModel.find(query || {}).populate("roles").exec();
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
