import { InterfacePaypalPaymentRepository, InterfacePaypalPaymentService, PaypalPayment } from "types/payments/PaypalPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class PaypalPaymentService implements InterfacePaypalPaymentService {
    private paypalPaymentRepository: InterfacePaypalPaymentRepository;

    constructor(paypalPaymentRepository: InterfacePaypalPaymentRepository) {
        this.paypalPaymentRepository = paypalPaymentRepository;
    }

    async createPaypalPayment(paypalPayment: PaypalPayment): Promise<PaypalPayment> {
        return await this.paypalPaymentRepository.create(paypalPayment);
    }
    async findPaypalPayments(query?: Query, params?: Params): Promise<PaypalPayment[]> {
        const result = await this.paypalPaymentRepository.find(query, params);
        return result;
    }
    async countPaypalPayments(query?: Query): Promise<number> {
        return await this.paypalPaymentRepository.countPaypalPayments(query);
    }
    async findPaypalPaymentById(id: string): Promise<PaypalPayment | null> {
        return await this.paypalPaymentRepository.findById(id);
    }
    async findPaypalPaymentByEmail(email: string): Promise<PaypalPayment | null> {
        return await this.paypalPaymentRepository.findOne({ email });
    }
    async updatePaypalPayment(id: string, paypalPayment: Partial<PaypalPayment>): Promise<PaypalPayment | null> {
        return await this.paypalPaymentRepository.update(id, paypalPayment);
    }
    async deletePaypalPayment(id: string, paypalPaymentId?: string): Promise<boolean> {
        const PaypalPayment = await this.paypalPaymentRepository.delete(id, paypalPaymentId);
        return PaypalPayment ?? false;
    }
    async restorePaypalPayment(id: string): Promise<PaypalPayment | null> {
        return await this.paypalPaymentRepository.restore(id);
    }
}
