import { Request, Response } from "express";
import { WorkshopScheduleRepository } from "repositories/workshopScheduleRepositories";
import { WorkshopScheduleService } from "services/workshopScheduleService";
import { ResponseHandler } from "utils/ResponseHandler";
import { Params } from "types/RepositoryTypes";
import { sortsBuilder } from "utils/queryBuilders/CustomSortsBuilder";
import { filterBuilder } from "utils/queryBuilders/CustomFilterBuilder";
import { populateBuilder } from "utils/queryBuilders/CustomPopulateBuilder";
import { paginationBuilder } from "utils/queryBuilders/CustomPaginationBuilder";

// Inicializar repositorio y servicio
const workshopScheduleRepository = new WorkshopScheduleRepository();
const workshopScheduleService = new WorkshopScheduleService(workshopScheduleRepository);

export const findWorkshopSchedules = async (req: Request, res: Response) => {
    try {
        const params: Params = {
            sort: sortsBuilder(req.query.sort),
            populate: populateBuilder(req.query.populate),
            filter: filterBuilder(req.query.filter),
            page: req.query.page?.toString(),
            perPage: req.query.perPage?.toString(),
            all: req.query.all?.toString(),
        };

        const schedules = await workshopScheduleService.findWorkshopSchedules(params.filter, params);
        const total = await workshopScheduleService.countWorkshopSchedules(params.filter);

        if (schedules.length === 0) {
            res.status(404).json(ResponseHandler.notFound("No workshop schedules found", 404));
            return;
        }

        if (!params.all || params.all === "false" || params.all === "0") {
            const pagination = paginationBuilder(params, total);
            res.status(200).json(
                ResponseHandler.paginationSuccess(schedules, pagination, "Workshop schedules found successfully")
            );
        } else {
            res.status(200).json(ResponseHandler.success(schedules, "Workshop schedules found successfully"));
        }
    } catch (error: any) {
        console.error("Error finding workshop schedules:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const findWorkshopScheduleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const schedule = await workshopScheduleService.findWorkshopScheduleById(id);

        if (!schedule) {
            res.status(404).json(ResponseHandler.notFound("Workshop schedule not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(schedule, "Workshop schedule found successfully"));
    } catch (error: any) {
        console.error("Error finding workshop schedule:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const findWorkshopSchedulesByWorkshop = async (req: Request, res: Response) => {
    try {
        const { workshopId } = req.params;
        const schedules = await workshopScheduleService.findWorkshopSchedulesByWorkshop(workshopId);

        if (schedules.length === 0) {
            res.status(404).json(ResponseHandler.notFound("No schedules found for this workshop", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(schedules, "Workshop schedules found successfully"));
    } catch (error: any) {
        console.error("Error finding workshop schedules by workshop:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const createWorkshopSchedule = async (req: Request, res: Response) => {
    try {
        const scheduleData = req.body;
        
        const newSchedule = await workshopScheduleService.createWorkshopSchedule(scheduleData);
        res.status(201).json(ResponseHandler.success(newSchedule, "Workshop schedule created successfully"));
    } catch (error: any) {
        console.error("Error creating workshop schedule:", error.message);
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
            res.status(409).json({ error: "Schedule already exists for this workshop and day", statusCode: 409 });
        } else {
            res.status(400).json(ResponseHandler.badRequest("Bad request", 400));
        }
    }
};

export const updateWorkshopSchedule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const scheduleData = req.body;

        const updatedSchedule = await workshopScheduleService.updateWorkshopSchedule(id, scheduleData);

        if (!updatedSchedule) {
            res.status(404).json(ResponseHandler.notFound("Workshop schedule not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(updatedSchedule, "Workshop schedule updated successfully"));
    } catch (error: any) {
        console.error("Error updating workshop schedule:", error.message);
        res.status(400).json(ResponseHandler.badRequest("Bad request", 400));
    }
};

export const deleteWorkshopSchedule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedSchedule = await workshopScheduleService.deleteWorkshopSchedule(id);

        if (!deletedSchedule) {
            res.status(404).json(ResponseHandler.notFound("Workshop schedule not found", 404));
            return;
        }

        res.status(200).json(ResponseHandler.success(deletedSchedule, "Workshop schedule deleted successfully"));
    } catch (error: any) {
        console.error("Error deleting workshop schedule:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const getWorkshopAvailability = async (req: Request, res: Response) => {
    try {
        const { workshopId, date } = req.params;
        const appointmentDate = new Date(date);

        // Verificar si el taller está abierto en esa fecha
        const isOpen = await workshopScheduleService.isWorkshopOpenOnDate(workshopId, appointmentDate);
        
        if (!isOpen) {
            res.status(200).json(ResponseHandler.success({
                date: appointmentDate,
                workshopId,
                isOpen: false,
                availableSlots: [],
                message: "Workshop is closed on this date"
            }, "Workshop availability retrieved"));
            return;
        }

        // Obtener los horarios disponibles
        const availableSlots = await workshopScheduleService.getAvailableTimeSlots(workshopId, appointmentDate);
        const workshopHours = await workshopScheduleService.getWorkshopHoursForDate(workshopId, appointmentDate);

        res.status(200).json(ResponseHandler.success({
            date: appointmentDate,
            workshopId,
            isOpen: true,
            availableSlots,
            workshopHours,
            totalSlots: availableSlots.length
        }, "Workshop availability retrieved successfully"));
    } catch (error: any) {
        console.error("Error getting workshop availability:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};

export const createWeeklySchedule = async (req: Request, res: Response) => {
    try {
        const { workshopId } = req.params;
        const { weeklySchedule } = req.body; // Array of schedule objects for each day

        if (!Array.isArray(weeklySchedule) || weeklySchedule.length === 0) {
            res.status(400).json(ResponseHandler.badRequest("Weekly schedule array is required", 400));
            return;
        }

        const createdSchedules = [];
        const errors = [];

        for (const daySchedule of weeklySchedule) {
            try {
                const scheduleData = {
                    ...daySchedule,
                    workshop: workshopId
                };
                
                const newSchedule = await workshopScheduleService.createWorkshopSchedule(scheduleData);
                createdSchedules.push(newSchedule);
            } catch (error: any) {
                errors.push({
                    dayOfWeek: daySchedule.dayOfWeek,
                    error: error.message
                });
            }
        }

        if (errors.length > 0 && createdSchedules.length === 0) {
            res.status(400).json(ResponseHandler.badRequest("Failed to create any schedules", 400));
            return;
        }

        res.status(201).json(ResponseHandler.success({
            createdSchedules,
            errors: errors.length > 0 ? errors : undefined,
            message: `Created ${createdSchedules.length} schedules${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
        }, "Weekly schedule creation completed"));
    } catch (error: any) {
        console.error("Error creating weekly schedule:", error.message);
        res.status(500).json(ResponseHandler.internalServerError(500, "Internal server error"));
    }
};
