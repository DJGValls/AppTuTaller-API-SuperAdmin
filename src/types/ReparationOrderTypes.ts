import mongoose, { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";
import { Workshop } from "./WorkshopTypes";
export interface ReparationOrder extends Document {
    name: string;
    description: string;
    workshop: mongoose.Types.ObjectId;
    reparationTasks?: mongoose.Types.ObjectId[];
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
export interface InterfaceReparationOrderRepository extends Repository<ReparationOrder> {
    countReparationOrders(query?: Query): Promise<number>;
    findOne(query: Query): Promise<ReparationOrder | null>;
    restore(id: string): Promise<ReparationOrder | null>;
}
export interface InterfaceReparationOrderService {
    createReparationOrder(reparationOrder: ReparationOrder): Promise<ReparationOrder>;
    findReparationOrders(query?: Query, params?: Params): Promise<ReparationOrder[]>;
    findReparationOrderById(id: string): Promise<ReparationOrder | null>;
    updateReparationOrder(id: string, reparationOrder: Partial<ReparationOrder>): Promise<ReparationOrder | null>;
    deleteReparationOrder(id: string, userId: string): Promise<boolean>;
    restoreReparationOrder(id: string): Promise<ReparationOrder | null>;
}