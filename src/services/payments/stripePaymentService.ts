import { InterfaceStripePaymentRepository, InterfaceStripePaymentService, StripePayment } from "types/payments/StripePaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class StripePaymentService implements InterfaceStripePaymentService {
    private stripePaymentRepository: InterfaceStripePaymentRepository;

    constructor(stripePaymentRepository: InterfaceStripePaymentRepository) {
        this.stripePaymentRepository = stripePaymentRepository;
    }

    async createStripePayment(stripePayment: StripePayment): Promise<StripePayment> {
        return await this.stripePaymentRepository.create(stripePayment);
    }
    async findStripePayments(query?: Query, params?: Params): Promise<StripePayment[]> {
        const result = await this.stripePaymentRepository.find(query, params);
        return result;
    }
    async countStripePayments(query?: Query): Promise<number> {
        return await this.stripePaymentRepository.countStripePayments(query);
    }
    async findStripePaymentById(id: string): Promise<StripePayment | null> {
        return await this.stripePaymentRepository.findById(id);
    }
    async updateStripePayment(id: string, stripePayment: Partial<StripePayment>): Promise<StripePayment | null> {
        return await this.stripePaymentRepository.update(id, stripePayment);
    }
    async deleteStripePayment(id: string, stripePaymentId?: string): Promise<boolean> {
        const stripePayment = await this.stripePaymentRepository.delete(id, stripePaymentId);
        return stripePayment ?? false;
    }
    async restoreStripePayment(id: string): Promise<StripePayment | null> {
        return await this.stripePaymentRepository.restore(id);
    }
}
