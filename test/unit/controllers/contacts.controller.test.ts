import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    findContacts,
    findContactById,
    createContact,
    updateContact,
    deleteContact,
    restoreContact
} from "../../../src/controllers/contacts.controller";
import { ContactService } from "../../../src/services/contactService";
import { ResponseHandler } from "../../../src/utils/ResponseHandler";

// Extend Request interface for testing
interface ExtendedRequest extends Request {
    currentUser?: { id: string };
}

// Mock del ContactService
jest.mock("../../../src/services/contactService");

// Mock de query builders
jest.mock("../../../src/utils/queryBuilders/CustomSortsBuilder", () => ({
    sortsBuilder: jest.fn(() => ({}))
}));

jest.mock("../../../src/utils/queryBuilders/CustomPopulateBuilder", () => ({
    populateBuilder: jest.fn(() => ({}))
}));

jest.mock("../../../src/utils/queryBuilders/CustomFilterBuilder", () => ({
    filterBuilder: jest.fn(() => ({}))
}));

jest.mock("../../../src/utils/queryBuilders/CustomPaginationBuilder", () => ({
    paginationBuilder: jest.fn(() => ({
        page: 1,
        perPage: 10,
        total: 100,
        totalPages: 10
    }))
}));

// Mock de ResponseHandler
jest.mock("../../../src/utils/ResponseHandler", () => ({
    ResponseHandler: {
        success: jest.fn((data, message, status) => ({ data, message, status: status || 200 })),
        paginationSuccess: jest.fn((data, pagination, message) => ({ data, pagination, message, status: 200 })),
        error: jest.fn((message, status) => ({ message, status: status || 500 })),
        badRequest: jest.fn((message, status) => ({ message, status: status || 400 })),
        notFound: jest.fn((message, status) => ({ message, status: status || 404 })),
        internalServerError: jest.fn((status) => ({ message: "Internal Server Error", status: status || 500 })),
        handleMongooseError: jest.fn((error) => ({ message: error.message, status: 400 }))
    }
}));

describe("Contacts Controller", () => {
    let mockReq: Partial<ExtendedRequest>;
    let mockRes: Partial<Response>;
    let mockContactService: jest.Mocked<ContactService>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockReq = {
            query: {},
            params: {},
            body: {},
            currentUser: { id: "user123" }
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockContactService = {
            findContacts: jest.fn(),
            countContacts: jest.fn(),
            findContactById: jest.fn(),
            createContact: jest.fn(),
            updateContact: jest.fn(),
            deleteContact: jest.fn(),
            restoreContact: jest.fn()
        } as any;

        (ContactService as jest.MockedClass<typeof ContactService>).mockImplementation(() => mockContactService);
    });

    describe("findContacts", () => {
        it("should return paginated contacts successfully", async () => {
            const mockContacts = [
                { _id: "1", name: "Contact 1", email: "contact1@test.com" },
                { _id: "2", name: "Contact 2", email: "contact2@test.com" }
            ];

            mockReq.query = {
                page: "1",
                perPage: "10",
                all: "false"
            };

            mockContactService.findContacts.mockResolvedValue(mockContacts);
            mockContactService.countContacts.mockResolvedValue(100);

            await findContacts(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockContactService.findContacts).toHaveBeenCalled();
            expect(mockContactService.countContacts).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(ResponseHandler.paginationSuccess).toHaveBeenCalledWith(
                mockContacts,
                expect.any(Object),
                "Contactos encontrados exitosamente"
            );
        });

        it("should return all contacts when all=true", async () => {
            const mockContacts = [
                { _id: "1", name: "Contact 1", email: "contact1@test.com" }
            ];

            mockReq.query = { all: "true" };
            mockContactService.findContacts.mockResolvedValue(mockContacts);
            mockContactService.countContacts.mockResolvedValue(1);

            await findContacts(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(ResponseHandler.success).toHaveBeenCalledWith(
                mockContacts,
                "Contactos encontrados exitosamente"
            );
        });

        it("should return 404 when no contacts found", async () => {
            mockContactService.findContacts.mockResolvedValue([]);
            mockContactService.countContacts.mockResolvedValue(0);

            await findContacts(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(ResponseHandler.notFound).toHaveBeenCalledWith("Contactos no encontrados", 404);
        });

        it("should handle general errors", async () => {
            const error = new Error("Database error");
            mockContactService.findContacts.mockRejectedValue(error);

            await findContacts(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.error).toHaveBeenCalledWith("Database error");
        });

        it("should handle mongoose errors", async () => {
            const mongooseError = new mongoose.Error.CastError("ObjectId", "invalid-id", "_id");
            mockContactService.findContacts.mockRejectedValue(mongooseError);

            await findContacts(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.handleMongooseError).toHaveBeenCalledWith(mongooseError);
        });

        it("should handle unknown errors", async () => {
            const unknownError = "Unknown error";
            mockContactService.findContacts.mockRejectedValue(unknownError);

            await findContacts(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.internalServerError).toHaveBeenCalledWith(500);
        });
    });

    describe("findContactById", () => {
        it("should return contact by id successfully", async () => {
            const mockContact = { _id: "1", name: "Contact 1", email: "contact1@test.com" };
            
            mockReq.params = { id: "1" };
            mockContactService.findContactById.mockResolvedValue(mockContact);

            await findContactById(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockContactService.findContactById).toHaveBeenCalledWith("1");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(ResponseHandler.success).toHaveBeenCalledWith(
                mockContact,
                "Contacto encontrado exitosamente"
            );
        });

        it("should return 404 when contact not found", async () => {
            mockReq.params = { id: "1" };
            mockContactService.findContactById.mockResolvedValue(null);

            await findContactById(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(ResponseHandler.notFound).toHaveBeenCalledWith("Contacto no encontrado", 404);
        });

        it("should handle general errors", async () => {
            const error = new Error("Database error");
            mockReq.params = { id: "1" };
            mockContactService.findContactById.mockRejectedValue(error);

            await findContactById(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.error).toHaveBeenCalledWith("Database error");
        });

        it("should handle mongoose errors", async () => {
            const mongooseError = new mongoose.Error.CastError("ObjectId", "invalid-id", "_id");
            mockReq.params = { id: "invalid-id" };
            mockContactService.findContactById.mockRejectedValue(mongooseError);

            await findContactById(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.handleMongooseError).toHaveBeenCalledWith(mongooseError);
        });
    });

    describe("createContact", () => {
        it("should create contact successfully", async () => {
            const newContact = { name: "New Contact", email: "new@test.com" };
            const createdContact = { _id: "1", ...newContact };

            mockReq.body = newContact;
            mockContactService.createContact.mockResolvedValue(createdContact);

            await createContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockContactService.createContact).toHaveBeenCalledWith(newContact);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(ResponseHandler.success).toHaveBeenCalledWith(
                createdContact,
                "Contacto creado exitosamente",
                201
            );
        });

        it("should handle validation errors", async () => {
            const validationError = new Error("Validation failed");
            mockReq.body = { name: "" };
            mockContactService.createContact.mockRejectedValue(validationError);

            await createContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(ResponseHandler.badRequest).toHaveBeenCalledWith("Validation failed", 400);
        });

        it("should handle mongoose errors", async () => {
            const mongooseError = new mongoose.Error.ValidationError();
            mockReq.body = { name: "Test" };
            mockContactService.createContact.mockRejectedValue(mongooseError);

            await createContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(ResponseHandler.handleMongooseError).toHaveBeenCalledWith(mongooseError);
        });

        it("should handle unknown errors", async () => {
            const unknownError = "Unknown error";
            mockReq.body = { name: "Test" };
            mockContactService.createContact.mockRejectedValue(unknownError);

            await createContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.internalServerError).toHaveBeenCalledWith(500);
        });
    });

    describe("updateContact", () => {
        it("should update contact successfully", async () => {
            const updatedContact = { _id: "1", name: "Updated Contact", email: "updated@test.com" };
            const updateData = { name: "Updated Contact" };

            mockReq.params = { id: "1" };
            mockReq.body = updateData;
            mockContactService.updateContact.mockResolvedValue(updatedContact);

            await updateContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockContactService.updateContact).toHaveBeenCalledWith("1", updateData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(ResponseHandler.success).toHaveBeenCalledWith(
                updatedContact,
                "Contacto actualizado exitosamente"
            );
        });

        it("should return 404 when contact not found", async () => {
            mockReq.params = { id: "1" };
            mockReq.body = { name: "Updated" };
            mockContactService.updateContact.mockResolvedValue(null);

            await updateContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(ResponseHandler.notFound).toHaveBeenCalledWith("Contacto no encontrado", 404);
        });

        it("should handle general errors", async () => {
            const error = new Error("Update failed");
            mockReq.params = { id: "1" };
            mockReq.body = { name: "Updated" };
            mockContactService.updateContact.mockRejectedValue(error);

            await updateContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.error).toHaveBeenCalledWith("Update failed");
        });
    });

    describe("deleteContact", () => {
        it("should delete contact successfully", async () => {
            mockReq.params = { id: "1" };
            mockReq.currentUser = { id: "user123" };
            mockContactService.deleteContact.mockResolvedValue(true);

            await deleteContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockContactService.deleteContact).toHaveBeenCalledWith("1", "user123");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(ResponseHandler.success).toHaveBeenCalledWith(
                true,
                "Contacto eliminado exitosamente"
            );
        });

        it("should return 404 when contact not found", async () => {
            mockReq.params = { id: "1" };
            mockReq.currentUser = { id: "user123" };
            mockContactService.deleteContact.mockResolvedValue(false);

            await deleteContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(ResponseHandler.notFound).toHaveBeenCalledWith("Contacto no encontrado", 404);
        });

        it("should handle general errors", async () => {
            const error = new Error("Delete failed");
            mockReq.params = { id: "1" };
            mockReq.currentUser = { id: "user123" };
            mockContactService.deleteContact.mockRejectedValue(error);

            await deleteContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.error).toHaveBeenCalledWith("Delete failed");
        });
    });

    describe("restoreContact", () => {
        it("should restore contact successfully", async () => {
            const restoredContact = { _id: "1", name: "Restored Contact", deletedAt: null };

            mockReq.params = { id: "1" };
            mockContactService.restoreContact.mockResolvedValue(restoredContact);

            await restoreContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockContactService.restoreContact).toHaveBeenCalledWith("1");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(ResponseHandler.success).toHaveBeenCalledWith(
                restoredContact,
                "Contacto restaurado exitosamente"
            );
        });

        it("should return 404 when contact not found", async () => {
            mockReq.params = { id: "1" };
            mockContactService.restoreContact.mockResolvedValue(null);

            await restoreContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(ResponseHandler.notFound).toHaveBeenCalledWith("Contacto no encontrado", 404);
        });

        it("should handle general errors", async () => {
            const error = new Error("Restore failed");
            mockReq.params = { id: "1" };
            mockContactService.restoreContact.mockRejectedValue(error);

            await restoreContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.error).toHaveBeenCalledWith("Restore failed");
        });

        it("should handle mongoose errors", async () => {
            const mongooseError = new mongoose.Error.CastError("ObjectId", "invalid-id", "_id");
            mockReq.params = { id: "invalid-id" };
            mockContactService.restoreContact.mockRejectedValue(mongooseError);

            await restoreContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.handleMongooseError).toHaveBeenCalledWith(mongooseError);
        });

        it("should handle unknown errors", async () => {
            const unknownError = "Unknown error";
            mockReq.params = { id: "1" };
            mockContactService.restoreContact.mockRejectedValue(unknownError);

            await restoreContact(mockReq as ExtendedRequest, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(ResponseHandler.internalServerError).toHaveBeenCalledWith(500);
        });
    });
});
