import { CreditCardPayment, InterfaceCreditCardPaymentRepository, InterfaceCreditCardPaymentService } from "types/payments/CreditCardPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class CreditCardPaymentService implements InterfaceCreditCardPaymentService {
    private creditCardPaymentRepository: InterfaceCreditCardPaymentRepository;

    constructor(creditCardPaymentRepository: InterfaceCreditCardPaymentRepository) {
        this.creditCardPaymentRepository = creditCardPaymentRepository;
    }

    async createCreditCardPayment(creditCardPayment: CreditCardPayment): Promise<CreditCardPayment> {
        return await this.creditCardPaymentRepository.create(creditCardPayment);
    }
    async findCreditCardPayments(query?: Query, params?: Params): Promise<CreditCardPayment[]> {
        const result = await this.creditCardPaymentRepository.find(query, params);
        return result;
    }
    async countCreditCardPayments(query?: Query): Promise<number> {
        return await this.creditCardPaymentRepository.countCreditCardPayments(query);
    }
    async findCreditCardPaymentById(id: string): Promise<CreditCardPayment | null> {
        return await this.creditCardPaymentRepository.findById(id);
    }
    async findCreditCardPaymentByEmail(email: string): Promise<CreditCardPayment | null> {
        return await this.creditCardPaymentRepository.findOne({ email });
    }
    async updateCreditCardPayment(id: string, creditCardPayment: Partial<CreditCardPayment>): Promise<CreditCardPayment | null> {
        return await this.creditCardPaymentRepository.update(id, creditCardPayment);
    }
    async deleteCreditCardPayment(id: string, creditCardPaymentId?: string): Promise<boolean> {
        const creditCardPayment = await this.creditCardPaymentRepository.delete(id, creditCardPaymentId);
        return creditCardPayment ?? false;
    }
    async restoreCreditCardPayment(id: string): Promise<CreditCardPayment | null> {
        return await this.creditCardPaymentRepository.restore(id);
    }
}
