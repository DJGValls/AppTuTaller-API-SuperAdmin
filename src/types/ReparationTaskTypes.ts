import mongoose, { Document } from "mongoose";
import { Params, Query, Repository } from "./RepositoryTypes";

export interface ReparationTask extends Document {
    name: string;
    description: string;
    reparationOrders: mongoose.Types.ObjectId[];
    status: "pending" | "in_progress" | "completed" | "cancelled";
    startDate?: Date;
    endDate?: Date;
    workshop: mongoose.Types.ObjectId;
    deletedAt?: Date;
    deletedBy?: mongoose.Types.ObjectId;
}

export interface InterfaceReparationTaskRepository extends Repository<ReparationTask> {
    countReparationTasks(query?: Query): Promise<number>;
    findOne(query: Query): Promise<ReparationTask | null>;
    restore(id: string): Promise<ReparationTask | null>;
}

export interface InterfaceReparationTaskService {
    createReparationTask(reparationTask: ReparationTask): Promise<ReparationTask>;
    findReparationTasks(query?: Query, params?: Params): Promise<ReparationTask[]>;
    findReparationTaskById(id: string): Promise<ReparationTask | null>;
    updateReparationTask(id: string, reparationTask: Partial<ReparationTask>): Promise<ReparationTask | null>;
    deleteReparationTask(id: string, userId?: string): Promise<boolean>;
    restoreReparationTask(id: string): Promise<ReparationTask | null>;
    countReparationTasks(query?: Query): Promise<number>;
}
