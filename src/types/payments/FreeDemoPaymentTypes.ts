import mongoose from "mongoose";
import { Query, Repository } from "../RepositoryTypes";

export interface FreeDemoPayment {
    dateStart: Date;
    expirationDate: Date;
    expirated: boolean;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfaceFreeDemoPaymentRepository extends Repository<FreeDemoPayment> {
    countFreeDemoPayments(query?: Query): Promise<number>;
    findOne(query: Query): Promise<FreeDemoPayment | null>;
    restore(id: string): Promise<FreeDemoPayment | null>;
}

export interface InterfaceFreeDemoPaymentService {
    createFreeDemoPayment(FreeDemoPayment: FreeDemoPayment): Promise<FreeDemoPayment>;
    findFreeDemoPayments(query?: Query): Promise<FreeDemoPayment[]>;
    findFreeDemoPaymentById(id: string): Promise<FreeDemoPayment | null>;
    updateFreeDemoPayment(id: string, FreeDemoPayment: Partial<FreeDemoPayment>): Promise<FreeDemoPayment | null>;
    deleteFreeDemoPayment(id: string, userId: string): Promise<boolean>;
    restoreFreeDemoPayment(id: string): Promise<FreeDemoPayment | null>;
}
