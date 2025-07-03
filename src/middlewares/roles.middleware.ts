import { NextFunction, Request, Response } from "express";
import { RolesRepository } from "repositories/rolesRepositories";
import { RolesService } from "services/rolesService";
import { InterfaceRolesRepository, Roles } from "types/RolesTypes";
import { ResponseHandler } from "utils/ResponseHandler";

// Instanciamos el repositorio de roles conforme a la interfaz definida
const rolesRepository: InterfaceRolesRepository = new RolesRepository();
// Creamos el servicio de roles pasando el repositorio instanciado
const rolesService = new RolesService(rolesRepository);

export const checkRoles = async (req: Request, res: Response, next: NextFunction) => {
    // Verificamos que el usuario existe
    if (!req.currentUser) {
        res.status(401).json(ResponseHandler.unauthorized("Usuario no autorizado", 401));
        return;
    }
    
    // Extraemos los roles del usuario (después del populate, pueden ser objetos Roles)
    const userRoles = req.currentUser.roles as any[] ?? [];
    
    // Validamos que "roles" sea un array no vacío; si está vacío, lo dejamos vacio para que genere el error de validacion"
    const roleNames = Array.isArray(userRoles) && userRoles.length !== 0 
        ? userRoles.map((role: any) => role.name || role) // Si es un objeto usa name, si es string usa el valor directo
        : [];
        
    try {
        // Buscamos en la base de datos los roles cuyos nombres coincidan con alguno de los elementos del array "role"
        // Se utiliza el operador $in para encontrar documentos donde el campo "name" tenga alguno de los valores proporcionados
        const findRoles = await rolesService.findRoles({ name: { $in: roleNames } });
        if (findRoles.length === 0) {
            res.status(404).json(ResponseHandler.notFound("Roles no encontrados", 404));
            return;
        }
        // Si se encontraron roles, se reemplazan los roles en el cuerpo de la petición por sus respectivos IDs
        req.body.roles = findRoles.map((role) => role._id);

        // Llamamos a next() para pasar el control al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json(ResponseHandler.error("Error interno del servidor"));
        return;
    }
};
