import { Request, Response } from "express";
import { findSubscriptions, findSubscriptionById, createSubscription, updateSubscription, deleteSubscription } from "../../../src/controllers/subscriptions.controller";
import { SubscriptionService } from "../../../src/services/subscriptionService";
import { ResponseHandler } from "../../../src/utils/ResponseHandler";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from "mongoose";
// Mock del servicio
jest.mock("services/subscriptionService");
describe("SubscriptionController", () => {
    let mockRequest: Partial<Request>;
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
        };
        mockResponse = {
            json: responseObject.json,
            status: responseObject.status,
        };
    });
    describe("findSubscriptions", () => {
        it("debería retornar suscripciones exitosamente", async () => {
            const mockSubscriptions = [{ _id: "1", title: "Premium" }];
            (SubscriptionService.prototype.findSubscriptions as jest.Mock).mockImplementation(() => Promise.resolve(mockSubscriptions));
            (SubscriptionService.prototype.countSubscriptions as jest.Mock).mockImplementation(() => Promise.resolve(1));
            await findSubscriptions(mockRequest as Request, mockResponse as Response);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true, mockSubscriptions
                })
            );
        });
        it("debería manejar el caso cuando no hay suscripciones", async () => {
            (SubscriptionService.prototype.findSubscriptions as jest.Mock).mockImplementation(() => Promise.resolve([]));
            
            await findSubscriptions(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Suscripciones no encontradas", 404)
            );
        });
    });
    describe("findSubscriptionById", () => {
        it("debería retornar una suscripción exitosamente", async () => {
            const mockSubscription = { _id: "1", title: "Premium" };
            mockRequest = {
                params: { id: "1" }
            };
            
            (SubscriptionService.prototype.findSubscriptionById as jest.Mock).mockImplementation(() => Promise.resolve(mockSubscription));
            
            await findSubscriptionById(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockSubscription, "Suscripcion encontrada exitosamente")
            );
        });
        it("debería manejar el caso cuando no se encuentra la suscripción", async () => {
            mockRequest = {
                params: { id: "999" }
            };
            
            (SubscriptionService.prototype.findSubscriptionById as jest.Mock).mockImplementation(() => Promise.resolve(null));
            
            await findSubscriptionById(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Suscripcion no encontrada", 404)
            );
        });
    });
    describe("createSubscription", () => {
        it("debería crear una suscripción exitosamente", async () => {
            const mockSubscription = { 
                _id: "1", 
                title: "Premium",
                description: "Descripción premium",
                price: 99.99,
                durationType: new mongoose.Types.ObjectId()
            };
            mockRequest = {
                body: mockSubscription
            };
            
            (SubscriptionService.prototype.createSubscription as jest.Mock).mockImplementation(() => Promise.resolve(mockSubscription));
            
            await createSubscription(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockSubscription, "Suscripcion creado exitosamente", 201)
            );
        });
        it("debería manejar errores de validación", async () => {
            mockRequest = {
                body: { title: "" }
            };
            
            const validationError = new mongoose.Error.ValidationError();
            (SubscriptionService.prototype.createSubscription as jest.Mock).mockImplementation(() => Promise.reject(validationError));
            
            await createSubscription(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.handleMongooseError(validationError)
            );
        });
    });
    describe("updateSubscription", () => {
        it("debería actualizar una suscripción exitosamente", async () => {
            const mockSubscription = { _id: "1", title: "Premium Updated" };
            mockRequest = {
                params: { id: "1" },
                body: { title: "Premium Updated" }
            };
            
            (SubscriptionService.prototype.updateSubscription as jest.Mock).mockImplementation(() => Promise.resolve(mockSubscription));
            
            await updateSubscription(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockSubscription, "Suscripcion actualizado exitosamente")
            );
        });
        it("debería manejar el caso cuando no se encuentra la suscripción", async () => {
            mockRequest = {
                params: { id: "999" },
                body: { title: "No existe" }
            };
            
            (SubscriptionService.prototype.updateSubscription as jest.Mock).mockImplementation(() => Promise.resolve(null));
            
            await updateSubscription(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Suscripcion no encontrado", 404)
            );
        });
    });
    describe("deleteSubscription", () => {
        it("debería eliminar una suscripción exitosamente", async () => {
            mockRequest = {
                params: { id: "1" }
            };
            
            (SubscriptionService.prototype.deleteSubscription as jest.Mock).mockImplementation(() => Promise.resolve(true));
            
            await deleteSubscription(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(true, "Suscripcion eliminado exitosamente")
            );
        });
        it("debería manejar el caso cuando no se encuentra la suscripción", async () => {
            mockRequest = {
                params: { id: "999" }
            };
            
            (SubscriptionService.prototype.deleteSubscription as jest.Mock).mockImplementation(() => Promise.resolve(false));
            
            await deleteSubscription(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Suscripcion no encontrado", 404)
            );
        });
    });
});