import { Request, Response, NextFunction } from "express";
import { PaginationOptions } from "types/RepositoryTypes";
declare global {
    namespace Express {
        interface Request {
            pagination: PaginationOptions;
        }
    }
}
export const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        // Validaciones básicas
        if (page < 1) {
            res.status(400).json({ error: "El número de página debe ser mayor a 0" });
            return;
        }
        if (limit < 1 || limit > 100) {
            res.status(400).json({ error: "El límite debe estar entre 1 y 100" });
            return;
        }
        req.pagination = { page, limit };
        next();
    } catch (error) {
        next(error);
    }
};