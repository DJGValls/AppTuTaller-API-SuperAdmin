import { Request, Response } from "express";
import { AppointmentRepository } from "repositories/appointmentRepositories";
import { WorkshopScheduleRepository } from "repositories/workshopScheduleRepositories";
import { AppointmentService } from "services/appointmentService";
import { WorkshopScheduleService } from "services/workshopScheduleService";
import { ReparationOrderService } from "services/reparationOrderService";
import { ReparationOrderRepository } from "repositories/reparationOrderRepositories";
import { ResponseHandler } from "utils/ResponseHandler";
import { Params } from "types/RepositoryTypes";
import { AppointmentStatusEnum, ServiceTypeEnum } from "enums/AppointmentStatus.enums";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";

// Inicializar repositorios y servicios
const appointmentRepository = new AppointmentRepository();
const workshopScheduleRepository = new WorkshopScheduleRepository();
const reparationOrderRepository = new ReparationOrderRepository();

const workshopScheduleService = new WorkshopScheduleService(workshopScheduleRepository);
const reparationOrderService = new ReparationOrderService(reparationOrderRepository);
const appointmentService = new AppointmentService(
    appointmentRepository, 
    workshopScheduleService, 
    reparationOrderService
);

export const findAppointments = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };

        const appointments = await appointmentService.findAppointments(params.filter, params);
        const total = await appointmentService.countAppointments(params.filter);

        if (appointments.length === 0) {
            res.status(404).json(ResponseHandler.notFound("No appointments found", 404));
            return;
        }

        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(appointments, pagination, "Appointments found successfully")
            );
        } else {
            res.status(200).json(ResponseHandler.success(appointments, "Appointments found successfully"));
        }
    } catch (error: any) {
        console.error("Error finding appointments:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const findAppointmentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.findAppointmentById(id);

        if (!appointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(appointment, "Appointment found successfully"));
    } catch (error: any) {
        console.error("Error finding appointment:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const findAppointmentByNumber = async (req: Request, res: Response) => {
    try {
        const { appointmentNumber } = req.params;
        const appointment = await appointmentService.findAppointmentByNumber(appointmentNumber);

        if (!appointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(appointment, "Appointment found successfully"));
    } catch (error: any) {
        console.error("Error finding appointment by number:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentData = req.body;
        
        // Validar que el usuario actual sea el cliente o tenga permisos
        if (req.currentUser) {
            appointmentData.createdBy = req.currentUser.id;
            if (!appointmentData.client) {
                appointmentData.client = req.currentUser.id;
            }
        }

        const newAppointment = await appointmentService.createAppointment(appointmentData);
        res.status(201).json(ResponseHandler.success(newAppointment, "Appointment created successfully"));
    } catch (error: any) {
        console.error("Error creating appointment:", error.message);
        if (error.message.includes('not available')) {
            res.status(409).json({ error: error.message, statusCode: 409 });
        } else {
            res.status(400).json(ResponseHandler.badRequest("Bad request", 400));
        }
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const appointmentData = req.body;

        if (req.currentUser) {
            appointmentData.updatedBy = req.currentUser.id;
        }

        const updatedAppointment = await appointmentService.updateAppointment(id, appointmentData);

        if (!updatedAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(updatedAppointment, "Appointment updated successfully"));
    } catch (error: any) {
        console.error("Error updating appointment:", error.message);
        res.status(400).json(ResponseHandler.badRequest("Bad request", 400));
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await appointmentService.deleteAppointment(id);

        if (!deletedAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(deletedAppointment, "Appointment deleted successfully"));
    } catch (error: any) {
        console.error("Error deleting appointment:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const confirmAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { employeeId } = req.body;

        const confirmedAppointment = await appointmentService.confirmAppointment(id, employeeId);

        if (!confirmedAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(confirmedAppointment, "Appointment confirmed successfully"));
    } catch (error: any) {
        console.error("Error confirming appointment:", error.message);
        res.status(400).json(ResponseHandler.error("Bad request", "Failed to confirm appointment"));
    }
};

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            res.status(400).json(ResponseHandler.error("Cancellation reason is required", "Missing required field"));
            return;
        }

        const cancelledAppointment = await appointmentService.cancelAppointment(id, reason);

        if (!cancelledAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(cancelledAppointment, "Appointment cancelled successfully"));
    } catch (error: any) {
        console.error("Error cancelling appointment:", error.message);
        res.status(400).json(ResponseHandler.error("Bad request", "Failed to cancel appointment"));
    }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newDate, newStartTime } = req.body;

        if (!newDate || !newStartTime) {
            res.status(400).json(ResponseHandler.error("New date and start time are required", "Missing required fields"));
            return;
        }

        const rescheduledAppointment = await appointmentService.rescheduleAppointment(
            id, 
            new Date(newDate), 
            newStartTime
        );

        if (!rescheduledAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(rescheduledAppointment, "Appointment rescheduled successfully"));
    } catch (error: any) {
        console.error("Error rescheduling appointment:", error.message);
        if (error.message.includes('not available')) {
            res.status(409).json(ResponseHandler.error(error.message, "Slot not available"));
        } else {
            res.status(400).json(ResponseHandler.error("Bad request", "Failed to reschedule appointment"));
        }
    }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const { workshopId } = req.params;
        const { date, serviceType = ServiceTypeEnum.BASIC_MAINTENANCE } = req.query;

        if (!date) {
            res.status(400).json(ResponseHandler.error("Date is required", "Missing required parameter"));
            return;
        }

        const appointmentDate = new Date(date as string);
        const availableSlots = await appointmentService.getAvailableSlots(
            workshopId, 
            appointmentDate, 
            serviceType as ServiceTypeEnum
        );

        res.status(200).json(ResponseHandler.success(
            { 
                date: appointmentDate,
                workshopId,
                serviceType,
                availableSlots 
            }, 
            "Available slots retrieved successfully"
        ));
    } catch (error: any) {
        console.error("Error getting available slots:", error.message);
        res.status(500).json(ResponseHandler.error("Internal server error", "Failed to retrieve available slots"));
    }
};

export const startAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const startedAppointment = await appointmentService.startAppointment(id);

        if (!startedAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(startedAppointment, "Appointment started successfully"));
    } catch (error: any) {
        console.error("Error starting appointment:", error.message);
        res.status(400).json(ResponseHandler.error("Bad request", "Failed to start appointment"));
    }
};

export const completeAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { actualCost, notes } = req.body;

        const completedAppointment = await appointmentService.completeAppointment(id, actualCost, notes);

        if (!completedAppointment) {
            res.status(404).json(ResponseHandler.notFound("Appointment not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(completedAppointment, "Appointment completed successfully"));
    } catch (error: any) {
        console.error("Error completing appointment:", error.message);
        res.status(400).json(ResponseHandler.error("Bad request", "Failed to complete appointment"));
    }
};

export const createReparationOrderFromAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reparationOrder = await appointmentService.createReparationOrderFromAppointment(id);

        res.status(201).json(ResponseHandler.success(reparationOrder, "Reparation order created from appointment successfully"));
    } catch (error: any) {
        console.error("Error creating reparation order from appointment:", error.message);
        if (error.message.includes('not found')) {
            res.status(404).json(ResponseHandler.notFound(error.message, 404));
        } else {
            res.status(400).json(ResponseHandler.error("Bad request", "Failed to create reparation order"));
        }
    }
};

// Nuevos endpoints para calendario
export const getAvailabilityCalendar = async (req: Request, res: Response) => {
    try {
        const { workshopId } = req.params;
        const { month, year, serviceType = ServiceTypeEnum.BASIC_MAINTENANCE } = req.query;

        if (!month || !year) {
            res.status(400).json(ResponseHandler.error("Month and year are required", "Missing required parameters"));
            return;
        }

        const monthNumber = parseInt(month as string);
        const yearNumber = parseInt(year as string);

        const calendar = await appointmentService.getMonthlyAvailability(
            workshopId,
            yearNumber,
            monthNumber,
            serviceType as ServiceTypeEnum
        );

        res.status(200).json(ResponseHandler.success(
            {
                workshopId,
                month: monthNumber,
                year: yearNumber,
                serviceType,
                calendar
            },
            "Monthly availability retrieved successfully"
        ));
    } catch (error: any) {
        console.error("Error getting monthly availability:", error.message);
        res.status(500).json(ResponseHandler.error("Internal server error", "Failed to retrieve monthly availability"));
    }
};

export const checkMultipleDatesAvailability = async (req: Request, res: Response) => {
    try {
        const { workshopId } = req.params;
        const { dates, serviceType = ServiceTypeEnum.BASIC_MAINTENANCE } = req.body;

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            res.status(400).json(ResponseHandler.error("Dates array is required", "Missing required field"));
            return;
        }

        if (dates.length > 31) {
            res.status(400).json(ResponseHandler.error("Maximum 31 dates allowed per request", "Too many dates"));
            return;
        }

        const availability = await appointmentService.checkMultipleDatesAvailability(
            workshopId,
            dates.map(date => new Date(date)),
            serviceType as ServiceTypeEnum
        );

        res.status(200).json(ResponseHandler.success(
            {
                workshopId,
                serviceType,
                availability
            },
            "Multiple dates availability checked successfully"
        ));
    } catch (error: any) {
        console.error("Error checking multiple dates availability:", error.message);
        res.status(500).json(ResponseHandler.error("Internal server error", "Failed to check dates availability"));
    }
};

export const getWorkshopBusyDates = async (req: Request, res: Response) => {
    try {
        const { workshopId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json(ResponseHandler.error("Start date and end date are required", "Missing required parameters"));
            return;
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        // Validar que el rango no sea mayor a 3 meses
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 90) {
            res.status(400).json(ResponseHandler.error("Date range cannot exceed 90 days", "Range too large"));
            return;
        }

        const busyDates = await appointmentService.getWorkshopBusyDates(workshopId, start, end);

        res.status(200).json(ResponseHandler.success(
            {
                workshopId,
                startDate: start,
                endDate: end,
                busyDates
            },
            "Busy dates retrieved successfully"
        ));
    } catch (error: any) {
        console.error("Error getting busy dates:", error.message);
        res.status(500).json(ResponseHandler.error("Internal server error", "Failed to retrieve busy dates"));
    }
};
