import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ResponseHandler } from "utils/ResponseHandler";
import { AnyZodObject, ZodEffects } from "zod";
export const validate = (schema: AnyZodObject | ZodEffects<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error de validacion: ", error.message);
            res.status(400).json(ResponseHandler.badRequest(error.message, 400));
            return;
        } else if (error instanceof mongoose.Error) {
            res.status(400).json(ResponseHandler.handleMongooseError(error));
            return;
        } else {
            console.error("Error desconocido:", error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    }
};
