import { Request, Response } from "express";
import { createRoles, deleteRoles, findRoles, findRolesById, updateRoles } from "../../../src/controllers/roles.controller";
import { RolesService } from "../../../src/services/RolesService";
import { ResponseHandler } from "../../../src/utils/ResponseHandler";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from "mongoose";

// Mock del servicio
jest.mock("services/RolesService");

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
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
        prevPage: null,
        nextPage: null
    }))
}));

describe("RolesController", () => {
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
    describe("findRoles", () => {
        it("debería retornar roles exitosamente", async () => {
            const mockRoles = [{ _id: "1", name: "admin" }];
            (RolesService.prototype.findRoles as jest.Mock).mockImplementation(() => Promise.resolve(mockRoles));
            (RolesService.prototype.countRoles as jest.Mock).mockImplementation(() => Promise.resolve(1));
            
            await findRoles(mockRequest as Request, mockResponse as Response);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.paginationSuccess(
                    mockRoles,
                    {
                        total: 1,
                        page: 1,
                        perPage: 10,
                        totalPages: 1,
                        prevPage: null,
                        nextPage: null
                    },
                    "Roles encontrados exitosamente"
                )
            );
        });
        it("debería manejar el caso cuando no hay roles", async () => {
            (RolesService.prototype.findRoles as jest.Mock).mockImplementation(() => Promise.resolve([]));
            await findRoles(mockRequest as Request, mockResponse as Response);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Roles no encontrados", 404)
            );
        });
    });

    describe("findRolesById", () => {
        it("debería retornar un rol exitosamente", async () => {
            const mockRole = { _id: "1", name: "admin" };
            mockRequest = {
                params: { id: "1" }
            };
            (RolesService.prototype.findRolesById as jest.Mock).mockImplementation(() => Promise.resolve(mockRole));
            
            await findRolesById(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockRole, "Rol encontrado exitosamente")
            );
        });
        it("debería manejar el caso cuando no se encuentra el rol", async () => {
            mockRequest = {
                params: { id: "999" }
            };
            (RolesService.prototype.findRolesById as jest.Mock).mockImplementation(() => Promise.resolve(null));
            
            await findRolesById(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Rol no encontrado", 404)
            );
        });
        it("debería manejar errores de mongoose", async () => {
            mockRequest = {
                params: { id: "invalid-id" }
            };
            const mongooseError = new mongoose.Error("Error de mongoose");
            (RolesService.prototype.findRolesById as jest.Mock).mockImplementation(() => Promise.reject(mongooseError));
            
            await findRolesById(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.handleMongooseError(mongooseError)
            );
        });
    });

    describe("createRoles", () => {
        it("debería crear un rol exitosamente", async () => {
            const mockRole = { 
                _id: "1", 
                name: "newRole",
                permissions: ["permission1"]
            };
            mockRequest = {
                body: mockRole
            };
            
            (RolesService.prototype.createRoles as jest.Mock).mockImplementation(() => Promise.resolve(mockRole));
            
            await createRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockRole, "Rol creado exitosamente", 201)
            );
        });
        it("debería manejar errores de mongoose", async () => {
            const mongooseError = new mongoose.Error("Error de mongoose");
            mockRequest = {
                body: { name: "invalidRole" }
            };
            
            (RolesService.prototype.createRoles as jest.Mock).mockImplementation(() => Promise.reject(mongooseError));
            
            await createRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.handleMongooseError(mongooseError)
            );
        });
        it("debería manejar errores generales", async () => {
            mockRequest = {
                body: { name: "invalidRole" }
            };
            
            (RolesService.prototype.createRoles as jest.Mock).mockImplementation(() => Promise.reject(new Error("Error general")));
            
            await createRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.badRequest("Error al crear el rol", 400)
            );
        });
    });

    describe("updateRoles", () => {
        it("debería actualizar un rol exitosamente", async () => {
            const mockRole = { _id: "1", name: "updatedRole" };
            mockRequest = {
                params: { id: "1" },
                body: { name: "updatedRole" }
            };
            
            (RolesService.prototype.updateRoles as jest.Mock).mockImplementation(() => Promise.resolve(mockRole));
            
            await updateRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockRole, "Rol actualizado exitosamente")
            );
        });
        it("debería manejar el caso cuando no se encuentra el rol", async () => {
            mockRequest = {
                params: { id: "999" },
                body: { name: "nonexistentRole" }
            };
            
            (RolesService.prototype.updateRoles as jest.Mock).mockImplementation(() => Promise.resolve(null));
            
            await updateRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Rol no encontrado", 404)
            );
        });
        it("debería manejar errores de mongoose", async () => {
            mockRequest = {
                params: { id: "invalid-id" },
                body: { name: "invalidRole" }
            };
            const mongooseError = new mongoose.Error("Error de mongoose");
            (RolesService.prototype.updateRoles as jest.Mock).mockImplementation(() => Promise.reject(mongooseError));
            
            await updateRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.handleMongooseError(mongooseError)
            );
        });
    });
    describe("deleteRoles", () => {
        it("debería eliminar un rol exitosamente", async () => {
            mockRequest = {
                params: { id: "1" }
            };
            
            (RolesService.prototype.deleteRoles as jest.Mock).mockImplementation(() => Promise.resolve(true));
            
            await deleteRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(true, "Rol eliminado exitosamente")
            );
        });
        it("debería manejar el caso cuando no se encuentra el rol", async () => {
            mockRequest = {
                params: { id: "999" }
            };
            
            (RolesService.prototype.deleteRoles as jest.Mock).mockImplementation(() => Promise.resolve(false));
            
            await deleteRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Rol no encontrado", 404)
            );
        });
        it("debería manejar errores de mongoose", async () => {
            mockRequest = {
                params: { id: "invalid-id" }
            };
            const mongooseError = new mongoose.Error("Error de mongoose");
            (RolesService.prototype.deleteRoles as jest.Mock).mockImplementation(() => Promise.reject(mongooseError));
            
            await deleteRoles(mockRequest as Request, mockResponse as Response);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.handleMongooseError(mongooseError)
            );
        });
    });
});