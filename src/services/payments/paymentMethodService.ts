import { InterfacePaymentMethodRepository, InterfacePaymentMethodService, PaymentMethod } from "types/payments/PaymentMethodTypes";
import { Params, Query } from "types/RepositoryTypes";

export class PaymentMethodService implements InterfacePaymentMethodService {
    private paymentMethodRepository: InterfacePaymentMethodRepository;

    constructor(paymentMethodRepository: InterfacePaymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    async createPaymentMethod(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
        return await this.paymentMethodRepository.create(paymentMethod);
    }
    async findPaymentMethods(query?: Query, params?: Params): Promise<PaymentMethod[]> {
        const result = await this.paymentMethodRepository.find(query, params);
        return result;
    }
    async countPaymentMethods(query?: Query): Promise<number> {
        return await this.paymentMethodRepository.countPaymentMethods(query);
    }
    async findPaymentMethodById(id: string): Promise<PaymentMethod | null> {
        return await this.paymentMethodRepository.findById(id);
    }
    async updatePaymentMethod(id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
        return await this.paymentMethodRepository.update(id, paymentMethod);
    }
    async deletePaymentMethod(id: string, paymentMethodId?: string): Promise<boolean> {
        const PaymentMethod = await this.paymentMethodRepository.delete(id, paymentMethodId);
        return PaymentMethod ?? false;
    }
    async restorePaymentMethod(id: string): Promise<PaymentMethod | null> {
        return await this.paymentMethodRepository.restore(id);
    }
}
