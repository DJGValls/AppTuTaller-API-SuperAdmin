import { Request, Response, NextFunction } from 'express';
import { UserPermissionsEnum } from 'enums/UserPermissions.enums';
import { ResponseHandler } from 'utils/ResponseHandler';

/**
 * Middleware para verificar si el usuario tiene los permisos requeridos
 */
export const requirePermissions = (requiredPermissions: UserPermissionsEnum[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Verificar si el usuario está autenticado
            if (!req.currentUser) {
                res.status(401).json(ResponseHandler.error("Usuario no autenticado", "Error de autenticación", 401));
                return;
            }

            const userPermissions = req.currentUser.permissions || [];

            // Super Admin tiene todos los permisos
            if (userPermissions.includes(UserPermissionsEnum.ADMIN_GRANTED)) {
                next();
                return;
            }

            // Verificar si el usuario tiene todos los permisos requeridos
            const hasAllPermissions = requiredPermissions.every(permission => 
                userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                const missingPermissions = requiredPermissions.filter(permission => 
                    !userPermissions.includes(permission)
                );
                
                res.status(403).json(ResponseHandler.error(
                    `Permisos insuficientes. Faltan: ${missingPermissions.join(', ')}`,
                    "Error de autorización", 
                    403
                ));
                return;
            }

            next();
        } catch (error) {
            console.error('Error en middleware de permisos:', error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    };
};

/**
 * Middleware para verificar si el usuario tiene al menos uno de los permisos requeridos
 */
export const requireAnyPermission = (requiredPermissions: UserPermissionsEnum[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Verificar si el usuario está autenticado
            if (!req.currentUser) {
                res.status(401).json(ResponseHandler.error("Usuario no autenticado", "Error de autenticación", 401));
                return;
            }

            const userPermissions = req.currentUser.permissions || [];

            // Super Admin tiene todos los permisos
            if (userPermissions.includes(UserPermissionsEnum.ADMIN_GRANTED)) {
                next();
                return;
            }

            // Verificar si el usuario tiene al menos uno de los permisos requeridos
            const hasAnyPermission = requiredPermissions.some(permission => 
                userPermissions.includes(permission)
            );

            if (!hasAnyPermission) {
                res.status(403).json(ResponseHandler.error(
                    `Permisos insuficientes. Se requiere al menos uno de: ${requiredPermissions.join(', ')}`,
                    "Error de autorización", 
                    403
                ));
                return;
            }

            next();
        } catch (error) {
            console.error('Error en middleware de permisos:', error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    };
};

/**
 * Middleware para verificar permisos de workshop scope
 */
export const requireWorkshopPermission = (permission: UserPermissionsEnum) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Verificar si el usuario está autenticado
            if (!req.currentUser) {
                res.status(401).json(ResponseHandler.error("Usuario no autenticado", "Error de autenticación", 401));
                return;
            }

            const userPermissions = req.currentUser.permissions || [];

            // Super Admin tiene todos los permisos
            if (userPermissions.includes(UserPermissionsEnum.ADMIN_GRANTED)) {
                next();
                return;
            }

            // Verificar permiso específico
            if (!userPermissions.includes(permission)) {
                res.status(403).json(ResponseHandler.error(
                    `Permiso insuficiente: ${permission}`,
                    "Error de autorización", 
                    403
                ));
                return;
            }

            // TODO: Aquí se podría agregar lógica adicional para verificar 
            // que el usuario tiene acceso al workshop específico

            next();
        } catch (error) {
            console.error('Error en middleware de permisos de workshop:', error);
            res.status(500).json(ResponseHandler.internalServerError(500));
            return;
        }
    };
};
