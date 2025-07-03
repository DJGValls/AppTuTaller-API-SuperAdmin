import { InterfaceReparationTaskRepository, InterfaceReparationTaskService, ReparationTask } from "types/ReparationTaskTypes";
import { Params, Query } from "types/RepositoryTypes";

export class ReparationTaskService implements InterfaceReparationTaskService {
    private reparationTaskRepository: InterfaceReparationTaskRepository;

    constructor(reparationTaskRepository: InterfaceReparationTaskRepository) {
        this.reparationTaskRepository = reparationTaskRepository;
    }

    async createReparationTask(reparationTask: ReparationTask): Promise<ReparationTask> {
        return await this.reparationTaskRepository.create(reparationTask);
    }

    async findReparationTasks(query?: Query, params?: Params): Promise<ReparationTask[]> {
        const result = await this.reparationTaskRepository.find(query, params);
        return result;
    }

    async countReparationTasks(query?: Query): Promise<number> {
        return await this.reparationTaskRepository.countReparationTasks(query);
    }

    async findReparationTaskById(id: string): Promise<ReparationTask | null> {
        return await this.reparationTaskRepository.findById(id);
    }

    async updateReparationTask(id: string, reparationTask: Partial<ReparationTask>): Promise<ReparationTask | null> {
        return await this.reparationTaskRepository.update(id, reparationTask);
    }

    async deleteReparationTask(id: string, userId?: string): Promise<boolean> {
        const reparationTask = await this.reparationTaskRepository.delete(id, userId);
        return reparationTask ?? false;
    }

    async restoreReparationTask(id: string): Promise<ReparationTask | null> {
        return await this.reparationTaskRepository.restore(id);
    }
}
