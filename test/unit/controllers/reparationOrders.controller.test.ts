import { Request, Response } from "express";
import {
    createReparationOrder,
    deleteReparationOrder,
    findReparationOrders,
    findReparationOrderById,
    updateReparationOrder,
    restoreReparationOrder
} from "../../../src/controllers/reparationOrders.controller";
import { ReparationOrderService } from "../../../src/services/reparationOrderService";
import { WorkshopService } from "../../../src/services/workshopService";
import { ResponseHandler } from "../../../src/utils/ResponseHandler";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from "mongoose";

// Mock de los servicios
jest.mock("services/reparationOrderService");
jest.mock("services/workshopService");

// Mock de los query builders
jest.mock("utils/queryBuilders/CustomSortsBuilder", () => ({
    sortsBuilder: jest.fn(() => ({}))
}));
jest.mock("utils/queryBuilders/CustomPopulateBuilder", () => ({
    populateBuilder: jest.fn(() => ({}))
}));
jest.mock("utils/queryBuilders/CustomFilterBuilder", () => ({
    filterBuilder: jest.fn(() => ({}))
}));
jest.mock("utils/queryBuilders/CustomPaginationBuilder", () => ({
    paginationBuilder: jest.fn(() => ({
        total: 10,
        page: 1,
        perPage: 10,
        totalPages: 1,
        prevPage: null,
        nextPage: null
    }))
}));

describe("ReparationOrdersController", () => {
    let mockRequest: any;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Configurar el mock de response
        responseObject = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        mockRequest = {
            query: {},
            params: {},
            body: {},
            currentUser: {
                id: "user123",
                email: "test@example.com"
            }
        };

        mockResponse = {
            json: responseObject.json,
            status: responseObject.status,
        };
    });

    describe("findReparationOrders", () => {
        it("debería retornar órdenes de reparación exitosamente con paginación", async () => {
            const mockReparationOrders = [
                { _id: "1", description: "Reparación motor", workshop: "workshop1" },
                { _id: "2", description: "Cambio de aceite", workshop: "workshop1" }
            ];

            (ReparationOrderService.prototype.findReparationOrders as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockReparationOrders));
            (ReparationOrderService.prototype.countReparationOrders as jest.Mock)
                .mockImplementation(() => Promise.resolve(10));

            mockRequest.query = { page: "1", perPage: "10" };

            await findReparationOrders(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.paginationSuccess(
                    mockReparationOrders,
                    {
                        total: 10,
                        page: 1,
                        perPage: 10,
                        totalPages: 1,
                        prevPage: null,
                        nextPage: null
                    },
                    "Ordenes de reparacion encontrados exitosamente"
                )
            );
        });

        it("debería retornar todas las órdenes cuando all=true", async () => {
            const mockReparationOrders = [
                { _id: "1", description: "Reparación motor", workshop: "workshop1" }
            ];

            (ReparationOrderService.prototype.findReparationOrders as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockReparationOrders));
            (ReparationOrderService.prototype.countReparationOrders as jest.Mock)
                .mockImplementation(() => Promise.resolve(1));

            mockRequest.query = { all: "true" };

            await findReparationOrders(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockReparationOrders, "Ordenes de reparacion encontrados exitosamente")
            );
        });

        it("debería manejar el caso cuando no hay órdenes de reparación", async () => {
            (ReparationOrderService.prototype.findReparationOrders as jest.Mock)
                .mockImplementation(() => Promise.resolve([]));

            await findReparationOrders(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Ordenes de reparaciones no encontrados", 404)
            );
        });

        it("debería manejar errores de mongoose", async () => {
            const mongooseError = new mongoose.Error("Error de mongoose");
            (ReparationOrderService.prototype.findReparationOrders as jest.Mock)
                .mockImplementation(() => Promise.reject(mongooseError));

            await findReparationOrders(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.error("Error de mongoose")
            );
        });
    });

    describe("findReparationOrderById", () => {
        it("debería retornar una orden de reparación exitosamente", async () => {
            const mockReparationOrder = { 
                _id: "1", 
                description: "Reparación motor", 
                workshop: "workshop1" 
            };

            mockRequest.params = { id: "1" };
            (ReparationOrderService.prototype.findReparationOrderById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockReparationOrder));

            await findReparationOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockReparationOrder, "Ordenes de reparacion encontrado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra la orden", async () => {
            mockRequest.params = { id: "999" };
            (ReparationOrderService.prototype.findReparationOrderById as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await findReparationOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404)
            );
        });
    });

    describe("createReparationOrder", () => {
        const mockWorkshop = {
            _id: "workshop1",
            name: "Taller Central",
            workshopAdmin: "user123",
            employees: ["user456", "user789"],
            clients: ["user111", "user222"]
        };

        it("debería crear una orden de reparación exitosamente cuando el usuario es administrador", async () => {
            const newReparationOrder = {
                description: "Nueva reparación",
                workshop: "workshop1"
            };

            const createdOrder = { 
                _id: "newOrder1", 
                ...newReparationOrder 
            };

            mockRequest.body = newReparationOrder;
            
            (WorkshopService.prototype.findWorkshopById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockWorkshop));
            (ReparationOrderService.prototype.createReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(createdOrder));

            await createReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(createdOrder, "orden de reparacion creado exitosamente", 201)
            );
        });

        it("debería crear una orden de reparación exitosamente cuando el usuario es empleado", async () => {
            const newReparationOrder = {
                description: "Nueva reparación",
                workshop: "workshop1"
            };

            const createdOrder = { 
                _id: "newOrder1", 
                ...newReparationOrder 
            };

            // Cambiar el usuario actual para que sea un empleado
            mockRequest.currentUser = { id: "user456", email: "employee@example.com" };
            mockRequest.body = newReparationOrder;
            
            (WorkshopService.prototype.findWorkshopById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockWorkshop));
            (ReparationOrderService.prototype.createReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(createdOrder));

            await createReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(createdOrder, "orden de reparacion creado exitosamente", 201)
            );
        });

        it("debería crear una orden de reparación exitosamente cuando el usuario es cliente", async () => {
            const newReparationOrder = {
                description: "Nueva reparación",
                workshop: "workshop1"
            };

            const createdOrder = { 
                _id: "newOrder1", 
                ...newReparationOrder 
            };

            // Cambiar el usuario actual para que sea un cliente
            mockRequest.currentUser = { id: "user111", email: "client@example.com" };
            mockRequest.body = newReparationOrder;
            
            (WorkshopService.prototype.findWorkshopById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockWorkshop));
            (ReparationOrderService.prototype.createReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(createdOrder));

            await createReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(createdOrder, "orden de reparacion creado exitosamente", 201)
            );
        });

        it("debería rechazar la creación cuando el workshop no existe", async () => {
            const newReparationOrder = {
                description: "Nueva reparación",
                workshop: "nonexistent"
            };

            mockRequest.body = newReparationOrder;
            
            (WorkshopService.prototype.findWorkshopById as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await createReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.forbidden("El workshop no existe o el usuario no pertenece a este workshop", 403)
            );
        });

        it("debería rechazar la creación cuando el usuario no pertenece al workshop", async () => {
            const newReparationOrder = {
                description: "Nueva reparación",
                workshop: "workshop1"
            };

            // Usuario que no pertenece al workshop
            mockRequest.currentUser = { id: "user999", email: "unauthorized@example.com" };
            mockRequest.body = newReparationOrder;
            
            (WorkshopService.prototype.findWorkshopById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockWorkshop));

            await createReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.forbidden("El workshop no existe o el usuario no pertenece a este workshop", 403)
            );
        });

        it("debería manejar errores durante la creación", async () => {
            const newReparationOrder = {
                description: "Nueva reparación",
                workshop: "workshop1"
            };

            mockRequest.body = newReparationOrder;
            
            (WorkshopService.prototype.findWorkshopById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockWorkshop));
            (ReparationOrderService.prototype.createReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.reject(new Error("Error de validación")));

            await createReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.badRequest("Error de validación", 400)
            );
        });
    });

    describe("updateReparationOrder", () => {
        it("debería actualizar una orden de reparación exitosamente", async () => {
            const updatedOrder = { 
                _id: "1", 
                description: "Reparación actualizada", 
                workshop: "workshop1" 
            };

            mockRequest.params = { id: "1" };
            mockRequest.body = { description: "Reparación actualizada" };

            (ReparationOrderService.prototype.updateReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(updatedOrder));

            await updateReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(updatedOrder, "Ordenes de reparacion actualizado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra la orden a actualizar", async () => {
            mockRequest.params = { id: "999" };
            mockRequest.body = { description: "Reparación actualizada" };

            (ReparationOrderService.prototype.updateReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await updateReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404)
            );
        });
    });

    describe("deleteReparationOrder", () => {
        it("debería eliminar una orden de reparación exitosamente", async () => {
            const deletedOrder = { 
                _id: "1", 
                description: "Reparación eliminada", 
                deletedAt: new Date() 
            };

            mockRequest.params = { id: "1" };

            (ReparationOrderService.prototype.deleteReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(deletedOrder));

            await deleteReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(ReparationOrderService.prototype.deleteReparationOrder).toHaveBeenCalledWith("1", "user123");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(deletedOrder, "Ordenes de reparacion eliminado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra la orden a eliminar", async () => {
            mockRequest.params = { id: "999" };

            (ReparationOrderService.prototype.deleteReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await deleteReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404)
            );
        });
    });

    describe("restoreReparationOrder", () => {
        it("debería restaurar una orden de reparación exitosamente", async () => {
            const restoredOrder = { 
                _id: "1", 
                description: "Reparación restaurada",
                deletedAt: null 
            };

            mockRequest.params = { id: "1" };

            (ReparationOrderService.prototype.restoreReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(restoredOrder));

            await restoreReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(restoredOrder, "Ordenes de reparacion restaurado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra la orden a restaurar", async () => {
            mockRequest.params = { id: "999" };

            (ReparationOrderService.prototype.restoreReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await restoreReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Ordenes de reparacion no encontrado", 404)
            );
        });

        it("debería manejar errores durante la restauración", async () => {
            mockRequest.params = { id: "1" };

            const error = new Error("Error de conexión");
            (ReparationOrderService.prototype.restoreReparationOrder as jest.Mock)
                .mockImplementation(() => Promise.reject(error));

            await restoreReparationOrder(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.error("Error de conexión")
            );
        });
    });

    describe("Error handling", () => {
        it("debería manejar errores desconocidos", async () => {
            mockRequest.params = { id: "1" };

            (ReparationOrderService.prototype.findReparationOrderById as jest.Mock)
                .mockImplementation(() => Promise.reject("Error desconocido"));

            await findReparationOrderById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.internalServerError(500)
            );
        });
    });
});
