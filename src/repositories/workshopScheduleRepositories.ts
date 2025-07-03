import { WorkshopScheduleModel } from "models/workshopSchedule.model";
import { WorkshopSchedule, InterfaceWorkshopScheduleRepository } from "types/ScheduleTypes";

export class WorkshopScheduleRepository implements InterfaceWorkshopScheduleRepository {
    async createWorkshopSchedule(schedule: WorkshopSchedule): Promise<WorkshopSchedule> {
        try {
            const newSchedule = new WorkshopScheduleModel(schedule);
            return await newSchedule.save();
        } catch (error: any) {
            throw new Error(`Error creating workshop schedule: ${error.message}`);
        }
    }

    async findWorkshopSchedules(filter: Record<string, any> = {}, params: any = {}): Promise<WorkshopSchedule[]> {
        try {
            let query = WorkshopScheduleModel.find(filter);
            
            if (params.populate) {
                query = query.populate(params.populate);
            }
            
            if (params.sort) {
                query = query.sort(params.sort);
            }
            
            if (params.page && params.perPage) {
                const skip = (parseInt(params.page) - 1) * parseInt(params.perPage);
                query = query.skip(skip).limit(parseInt(params.perPage));
            }
            
            return await query.exec();
        } catch (error: any) {
            throw new Error(`Error finding workshop schedules: ${error.message}`);
        }
    }

    async findWorkshopScheduleById(id: string): Promise<WorkshopSchedule | null> {
        try {
            return await WorkshopScheduleModel.findById(id).populate('workshop').exec();
        } catch (error: any) {
            throw new Error(`Error finding workshop schedule by ID: ${error.message}`);
        }
    }

    async findWorkshopSchedulesByWorkshop(workshopId: string): Promise<WorkshopSchedule[]> {
        try {
            return await WorkshopScheduleModel.find({ 
                workshop: workshopId, 
                isActive: true 
            }).sort({ dayOfWeek: 1 }).exec();
        } catch (error: any) {
            throw new Error(`Error finding workshop schedules by workshop: ${error.message}`);
        }
    }

    async updateWorkshopSchedule(id: string, schedule: Partial<WorkshopSchedule>): Promise<WorkshopSchedule | null> {
        try {
            return await WorkshopScheduleModel.findByIdAndUpdate(
                id,
                { ...schedule, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).populate('workshop').exec();
        } catch (error: any) {
            throw new Error(`Error updating workshop schedule: ${error.message}`);
        }
    }

    async deleteWorkshopSchedule(id: string): Promise<WorkshopSchedule | null> {
        try {
            return await WorkshopScheduleModel.findByIdAndUpdate(
                id,
                { isActive: false, updatedAt: new Date() },
                { new: true }
            ).exec();
        } catch (error: any) {
            throw new Error(`Error deleting workshop schedule: ${error.message}`);
        }
    }

    async countWorkshopSchedules(filter: Record<string, any> = {}): Promise<number> {
        try {
            return await WorkshopScheduleModel.countDocuments(filter).exec();
        } catch (error: any) {
            throw new Error(`Error counting workshop schedules: ${error.message}`);
        }
    }
}
