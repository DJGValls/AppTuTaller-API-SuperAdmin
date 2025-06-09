import { Params, Query } from "types/RepositoryTypes";
import { InterfaceUserRepository, InterfaceUserService, User } from "../types/UserTypes";

export class UserService implements InterfaceUserService {
    private userRepository: InterfaceUserRepository;

    constructor(userRepository: InterfaceUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepository.create(user);
    }
    async findUsers(query?: Query, params?: Params): Promise<User[]> {
        const result = await this.userRepository.find(query, params);
        return result;
    }
    async countUsers(query?: Query): Promise<number> {
        return await this.userRepository.countUsers(query);
    }
    async findUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ email });
    }
    async updateUser(id: string, user: Partial<User>): Promise<User | null> {
        return await this.userRepository.update(id, user);
    }
    async deleteUser(id: string, userId?: string): Promise<boolean> {
        const user = await this.userRepository.delete(id, userId);
        return user ?? false;
    }
    async restoreUser(id: string): Promise<User | null> {
        return await this.userRepository.restore(id);
    }
}
