import { Params, Query } from "types/RepositoryTypes";
import { InterfaceWorkshopRepository, InterfaceWorkshopService, Workshop } from "types/WorkshopTypes";

export class WorkshopService implements InterfaceWorkshopService {
    private workshopRepository: InterfaceWorkshopRepository;

    constructor(workshopRepository: InterfaceWorkshopRepository) {
        this.workshopRepository = workshopRepository;
    }

    async createWorkshop(workshop: Workshop): Promise<Workshop> {
        return await this.workshopRepository.create(workshop);
    }
    async findWorkshops(query?: Query, params?: Params): Promise<Workshop[]> {
        const result = await this.workshopRepository.find(query, params);
        return result;
    }
    async countWorkshops(query?: Query): Promise<number> {
        return await this.workshopRepository.countWorkshops(query);
    }
    async findWorkshopById(id: string): Promise<Workshop | null> {
        return await this.workshopRepository.findById(id);
    }
    async updateWorkshop(id: string, workshop: Partial<Workshop>): Promise<Workshop | null> {
        return await this.workshopRepository.update(id, workshop);
    }
    async deleteWorkshop(id: string, userId?: string): Promise<boolean> {
        const workshop = await this.workshopRepository.delete(id, userId);
        return workshop ?? false;
    }
    async restoreWorkshop(id: string): Promise<Workshop | null> {
        return await this.workshopRepository.restore(id);
        
    }




}
