import { Request, Response } from "express";
import {
    findUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    restoreUser
} from "../../../src/controllers/users.controller";
import { UserService } from "../../../src/services/userService";
import { ContactService } from "../../../src/services/contactService";
import { RolesService } from "../../../src/services/RolesService";
import { WorkshopService } from "../../../src/services/workshopService";
import { ResponseHandler } from "../../../src/utils/ResponseHandler";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from "mongoose";

// Mock de los servicios
jest.mock("services/userService");
jest.mock("services/contactService");
jest.mock("services/RolesService");
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

describe("UsersController", () => {
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

    describe("findUsers", () => {
        it("debería retornar usuarios exitosamente con paginación", async () => {
            const mockUsers = [
                { _id: "1", email: "user1@example.com", contact: "contact1" },
                { _id: "2", email: "user2@example.com", contact: "contact2" }
            ];

            (UserService.prototype.findUsers as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockUsers));
            (UserService.prototype.countUsers as jest.Mock)
                .mockImplementation(() => Promise.resolve(10));

            mockRequest.query = { page: "1", perPage: "10" };

            await findUsers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.paginationSuccess(
                    mockUsers,
                    {
                        total: 10,
                        page: 1,
                        perPage: 10,
                        totalPages: 1,
                        prevPage: null,
                        nextPage: null
                    },
                    "Usuarios encontrados exitosamente"
                )
            );
        });

        it("debería retornar todos los usuarios cuando all=true", async () => {
            const mockUsers = [
                { _id: "1", email: "user1@example.com", contact: "contact1" }
            ];

            (UserService.prototype.findUsers as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockUsers));
            (UserService.prototype.countUsers as jest.Mock)
                .mockImplementation(() => Promise.resolve(1));

            mockRequest.query = { all: "true" };

            await findUsers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockUsers, "Usuarios encontrados exitosamente")
            );
        });

        it("debería manejar el caso cuando no hay usuarios", async () => {
            (UserService.prototype.findUsers as jest.Mock)
                .mockImplementation(() => Promise.resolve([]));

            await findUsers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Usuarios no encontrados", 404)
            );
        });

        it("debería manejar errores de mongoose", async () => {
            const mongooseError = new mongoose.Error("Error de mongoose");
            (UserService.prototype.findUsers as jest.Mock)
                .mockImplementation(() => Promise.reject(mongooseError));

            await findUsers(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.error("Error de mongoose")
            );
        });
    });

    describe("findUserById", () => {
        it("debería retornar un usuario exitosamente", async () => {
            const mockUser = { 
                _id: "1", 
                email: "user1@example.com", 
                contact: "contact1" 
            };

            mockRequest.params = { id: "1" };
            (UserService.prototype.findUserById as jest.Mock)
                .mockImplementation(() => Promise.resolve(mockUser));

            await findUserById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(mockUser, "Usuario encontrado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra el usuario", async () => {
            mockRequest.params = { id: "999" };
            (UserService.prototype.findUserById as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await findUserById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Usuario no encontrado", 404)
            );
        });
    });

    describe("createUser", () => {
        it("debería crear un usuario exitosamente", async () => {
            const newUser = {
                email: "newuser@example.com",
                password: "password123",
                contact: "contactId123"
            };

            const createdUser = { 
                _id: "newUser1", 
                ...newUser 
            };

            mockRequest.body = newUser;
            
            (UserService.prototype.createUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(createdUser));

            await createUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(createdUser, "Usuario creado exitosamente", 201)
            );
        });

        it("debería manejar errores durante la creación", async () => {
            const newUser = {
                email: "invalid-email",
                password: "123"
            };

            mockRequest.body = newUser;
            
            (UserService.prototype.createUser as jest.Mock)
                .mockImplementation(() => Promise.reject(new Error("Error de validación")));

            await createUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.badRequest("Error de validación", 400)
            );
        });
    });

    describe("updateUser", () => {
        it("debería actualizar un usuario exitosamente", async () => {
            const updatedUser = { 
                _id: "1", 
                email: "updated@example.com", 
                contact: "contact1" 
            };

            mockRequest.params = { id: "1" };
            mockRequest.body = { email: "updated@example.com" };

            (UserService.prototype.updateUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(updatedUser));

            await updateUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(updatedUser, "Usuario actualizado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra el usuario a actualizar", async () => {
            mockRequest.params = { id: "999" };
            mockRequest.body = { email: "updated@example.com" };

            (UserService.prototype.updateUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await updateUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Usuario no encontrado", 404)
            );
        });
    });

    describe("deleteUser", () => {
        it("debería eliminar un usuario exitosamente", async () => {
            const deletedUser = { 
                _id: "1", 
                email: "deleted@example.com", 
                deletedAt: new Date() 
            };

            mockRequest.params = { id: "1" };

            (UserService.prototype.deleteUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(true));

            await deleteUser(mockRequest as Request, mockResponse as Response);

            expect(UserService.prototype.deleteUser).toHaveBeenCalledWith("1", "user123");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(null, "Usuario eliminado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra el usuario a eliminar", async () => {
            mockRequest.params = { id: "999" };

            (UserService.prototype.deleteUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(false));

            await deleteUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Usuario no encontrado", 404)
            );
        });
    });

    describe("restoreUser", () => {
        it("debería restaurar un usuario exitosamente", async () => {
            const restoredUser = { 
                _id: "1", 
                email: "restored@example.com",
                deletedAt: null 
            };

            mockRequest.params = { id: "1" };

            (UserService.prototype.restoreUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(restoredUser));

            await restoreUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.success(restoredUser, "Usuario restaurado exitosamente")
            );
        });

        it("debería manejar el caso cuando no se encuentra el usuario a restaurar", async () => {
            mockRequest.params = { id: "999" };

            (UserService.prototype.restoreUser as jest.Mock)
                .mockImplementation(() => Promise.resolve(null));

            await restoreUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.notFound("Usuario no encontrado", 404)
            );
        });

        it("debería manejar errores durante la restauración", async () => {
            mockRequest.params = { id: "1" };

            const error = new Error("Error de conexión");
            (UserService.prototype.restoreUser as jest.Mock)
                .mockImplementation(() => Promise.reject(error));

            await restoreUser(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.error("Error de conexión")
            );
        });
    });

    describe("Error handling", () => {
        it("debería manejar errores desconocidos", async () => {
            mockRequest.params = { id: "1" };

            (UserService.prototype.findUserById as jest.Mock)
                .mockImplementation(() => Promise.reject("Error desconocido"));

            await findUserById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                ResponseHandler.internalServerError(500)
            );
        });
    });
});
