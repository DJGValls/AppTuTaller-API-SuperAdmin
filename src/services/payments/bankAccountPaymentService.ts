import { BankAccountPayment, InterfaceBankAccountPaymentRepository, InterfaceBankAccountPaymentService } from "types/payments/BankAccountPaymentTypes";
import { Params, Query } from "types/RepositoryTypes";

export class BankAccountPaymentService implements InterfaceBankAccountPaymentService {
    private bankAccountPaymentRepository: InterfaceBankAccountPaymentRepository;

    constructor(bankAccountPaymentRepository: InterfaceBankAccountPaymentRepository) {
        this.bankAccountPaymentRepository = bankAccountPaymentRepository;
    }

    async createBankAccountPayment(bankAccountPayment: BankAccountPayment): Promise<BankAccountPayment> {
        return await this.bankAccountPaymentRepository.create(bankAccountPayment);
    }
    async findBankAccountPayments(query?: Query, params?: Params): Promise<BankAccountPayment[]> {
        const result = await this.bankAccountPaymentRepository.find(query, params);
        return result;
    }
    async countBankAccountPayments(query?: Query): Promise<number> {
        return await this.bankAccountPaymentRepository.countBankAccountPayments(query);
    }
    async findBankAccountPaymentById(id: string): Promise<BankAccountPayment | null> {
        return await this.bankAccountPaymentRepository.findById(id);
    }
    async findBankAccountPaymentByBankName(bankName: string): Promise<BankAccountPayment | null> {
        return await this.bankAccountPaymentRepository.findOne({ bankName });
    }
    async updateBankAccountPayment(id: string, bankAccountPayment: Partial<BankAccountPayment>): Promise<BankAccountPayment | null> {
        return await this.bankAccountPaymentRepository.update(id, bankAccountPayment);
    }
    async deleteBankAccountPayment(id: string, bankAccountPaymentId?: string): Promise<boolean> {
        const bankAccountPayment = await this.bankAccountPaymentRepository.delete(id, bankAccountPaymentId);
        return bankAccountPayment ?? false;
    }
    async restoreBankAccountPayment(id: string): Promise<BankAccountPayment | null> {
        return await this.bankAccountPaymentRepository.restore(id);
    }
}
