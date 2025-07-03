import { InterfaceReparationOrderRepository, InterfaceReparationOrderService, ReparationOrder } from "types/ReparationOrderTypes";
import { Params, Query } from "types/RepositoryTypes";

export class ReparationOrderService implements InterfaceReparationOrderService {
    private reparationOrderRepository: InterfaceReparationOrderRepository;

    constructor(reparationOrderRepository: InterfaceReparationOrderRepository) {
        this.reparationOrderRepository = reparationOrderRepository;
    }

    async createReparationOrder(reparationOrder: ReparationOrder): Promise<ReparationOrder> {
        return await this.reparationOrderRepository.create(reparationOrder);
    }
    async findReparationOrders(query?: Query, params?: Params): Promise<ReparationOrder[]> {
        const result = await this.reparationOrderRepository.find(query, params);
        return result;
    }
    async countReparationOrders(query?: Query): Promise<number> {
        return await this.reparationOrderRepository.countReparationOrders(query);
    }
    async findReparationOrderById(id: string): Promise<ReparationOrder | null> {
        return await this.reparationOrderRepository.findById(id);
    }
    async updateReparationOrder(id: string, reparationOrder: Partial<ReparationOrder>): Promise<ReparationOrder | null> {
        return await this.reparationOrderRepository.update(id, reparationOrder);
    }
    async deleteReparationOrder(id: string, userId?: string): Promise<boolean> {
        const reparationOrder = await this.reparationOrderRepository.delete(id, userId);
        return reparationOrder ?? false;
    }
    async restoreReparationOrder(id: string): Promise<ReparationOrder | null> {
        return await this.reparationOrderRepository.restore(id);
        
    }




}
