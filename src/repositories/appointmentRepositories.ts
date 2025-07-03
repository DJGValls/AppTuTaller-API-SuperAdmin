import { AppointmentModel } from "models/appointment.model";
import { Appointment, InterfaceAppointmentRepository } from "types/AppointmentTypes";

export class AppointmentRepository implements InterfaceAppointmentRepository {
    async createAppointment(appointment: Appointment): Promise<Appointment> {
        try {
            const newAppointment = new AppointmentModel(appointment);
            return await newAppointment.save();
        } catch (error: any) {
            throw new Error(`Error creating appointment: ${error.message}`);
        }
    }

    async findAppointments(filter: Record<string, any> = {}, params: any = {}): Promise<Appointment[]> {
        try {
            let query = AppointmentModel.find(filter);
            
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
            throw new Error(`Error finding appointments: ${error.message}`);
        }
    }

    async findAppointmentById(id: string): Promise<Appointment | null> {
        try {
            return await AppointmentModel.findById(id)
                .populate('client')
                .populate('workshop')
                .populate('assignedEmployee')
                .populate('clientContact')
                .populate('reparationOrder')
                .exec();
        } catch (error: any) {
            throw new Error(`Error finding appointment by ID: ${error.message}`);
        }
    }

    async findAppointmentByNumber(appointmentNumber: string): Promise<Appointment | null> {
        try {
            return await AppointmentModel.findOne({ appointmentNumber })
                .populate('client')
                .populate('workshop')
                .populate('assignedEmployee')
                .populate('clientContact')
                .populate('reparationOrder')
                .exec();
        } catch (error: any) {
            throw new Error(`Error finding appointment by number: ${error.message}`);
        }
    }

    async findAppointmentsByWorkshop(workshopId: string, params: any = {}): Promise<Appointment[]> {
        try {
            return await this.findAppointments({ workshop: workshopId }, params);
        } catch (error: any) {
            throw new Error(`Error finding appointments by workshop: ${error.message}`);
        }
    }

    async findAppointmentsByClient(clientId: string, params: any = {}): Promise<Appointment[]> {
        try {
            return await this.findAppointments({ client: clientId }, params);
        } catch (error: any) {
            throw new Error(`Error finding appointments by client: ${error.message}`);
        }
    }

    async findAppointmentsByDateRange(workshopId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
        try {
            return await AppointmentModel.find({
                workshop: workshopId,
                appointmentDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
            .populate('client')
            .populate('assignedEmployee')
            .sort({ appointmentDate: 1, startTime: 1 })
            .exec();
        } catch (error: any) {
            throw new Error(`Error finding appointments by date range: ${error.message}`);
        }
    }

    async findAppointmentsByEmployee(employeeId: string, params: any = {}): Promise<Appointment[]> {
        try {
            return await this.findAppointments({ assignedEmployee: employeeId }, params);
        } catch (error: any) {
            throw new Error(`Error finding appointments by employee: ${error.message}`);
        }
    }

    async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | null> {
        try {
            return await AppointmentModel.findByIdAndUpdate(
                id,
                { ...appointment, updatedAt: new Date() },
                { new: true, runValidators: true }
            )
            .populate('client')
            .populate('workshop')
            .populate('assignedEmployee')
            .populate('clientContact')
            .populate('reparationOrder')
            .exec();
        } catch (error: any) {
            throw new Error(`Error updating appointment: ${error.message}`);
        }
    }

    async deleteAppointment(id: string): Promise<Appointment | null> {
        try {
            return await AppointmentModel.findByIdAndUpdate(
                id,
                { isActive: false, updatedAt: new Date() },
                { new: true }
            ).exec();
        } catch (error: any) {
            throw new Error(`Error deleting appointment: ${error.message}`);
        }
    }

    async countAppointments(filter: Record<string, any> = {}): Promise<number> {
        try {
            return await AppointmentModel.countDocuments(filter).exec();
        } catch (error: any) {
            throw new Error(`Error counting appointments: ${error.message}`);
        }
    }
}
