import mongoose, { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";
import { ActivationStatus } from "enums/StatusMethods.enum";
export interface Workshop extends Document {
    name: string;
    contact: mongoose.Types.ObjectId;
    status: ActivationStatus;
    paymentMethod: mongoose.Types.ObjectId;
    subscription: mongoose.Types.ObjectId;
    workshopAdmin: mongoose.Types.ObjectId;
    employees?: mongoose.Types.ObjectId[];
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}
export interface InterfaceWorkshopRepository extends Repository<Workshop> {
    countWorkshops(query?: Query): Promise<number>;
    findOne(query: Query): Promise<Workshop | null>;
    restore(id: string): Promise<Workshop | null>;
}
export interface InterfaceWorkshopService {
    createWorkshop(workshop: Workshop): Promise<Workshop>;
    findWorkshops(query?: Query, params?: Params): Promise<Workshop[]>;
    findWorkshopById(id: string): Promise<Workshop | null>;
    updateWorkshop(id: string, workshop: Partial<Workshop>): Promise<Workshop | null>;
    deleteWorkshop(id: string, userId: string): Promise<boolean>;
    restoreWorkshop(id: string): Promise<Workshop | null>;
}