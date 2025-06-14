import { FreeDemoPayment, InterfaceFreeDemoPaymentRepository, InterfaceFreeDemoPaymentService } from "types/payments/FreeDemoPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class FreeDemoPaymentService implements InterfaceFreeDemoPaymentService {
    private freeDemoPaymentRepository: InterfaceFreeDemoPaymentRepository;

    constructor(freeDemoPaymentRepository: InterfaceFreeDemoPaymentRepository) {
        this.freeDemoPaymentRepository = freeDemoPaymentRepository;
    }

    async createFreeDemoPayment(freeDemoPayment: FreeDemoPayment): Promise<FreeDemoPayment> {
        return await this.freeDemoPaymentRepository.create(freeDemoPayment);
    }
    async findFreeDemoPayments(query?: Query, params?: Params): Promise<FreeDemoPayment[]> {
        const result = await this.freeDemoPaymentRepository.find(query, params);
        return result;
    }
    async countFreeDemoPayments(query?: Query): Promise<number> {
        return await this.freeDemoPaymentRepository.countFreeDemoPayments(query);
    }
    async findFreeDemoPaymentById(id: string): Promise<FreeDemoPayment | null> {
        return await this.freeDemoPaymentRepository.findById(id);
    }
    async updateFreeDemoPayment(id: string, freeDemoPayment: Partial<FreeDemoPayment>): Promise<FreeDemoPayment | null> {
        return await this.freeDemoPaymentRepository.update(id, freeDemoPayment);
    }
    async deleteFreeDemoPayment(id: string, freeDemoPaymentId?: string): Promise<boolean> {
        const freeDemoPayment = await this.freeDemoPaymentRepository.delete(id, freeDemoPaymentId);
        return freeDemoPayment ?? false;
    }
    async restoreFreeDemoPayment(id: string): Promise<FreeDemoPayment | null> {
        return await this.freeDemoPaymentRepository.restore(id);
    }
}
