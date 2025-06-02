import { NextFunction, Request, Response } from "express";
import { RolesRepository } from "repositories/rolesRepositories";
import { RolesService } from "services/RolesService";
import { InterfaceRolesRepository } from "types/RolesTypes";
import { ResponseHandler } from "utils/ResponseHandler";

// Instanciamos el repositorio de roles conforme a la interfaz definida
const rolesRepository: InterfaceRolesRepository = new RolesRepository();
// Creamos el servicio de roles pasando el repositorio instanciado
const rolesService = new RolesService(rolesRepository);

export const checkRoles = async (req: Request, res: Response, next: NextFunction) => {
    // Extraemos los roles del cuerpo de la petición
    const roles: string[] = req.body && req.body.roles ? req.body.roles : [];

    // Validamos que "roles" sea un array no vacío; si está vacío, asignamos el rol por defecto "user"
    const role = Array.isArray(roles) && roles.length !== 0 ? roles : ["user"];
    try {
        // Buscamos en la base de datos los roles cuyos nombres coincidan con alguno de los elementos del array "role"
        // Se utiliza el operador $in para encontrar documentos donde el campo "name" tenga alguno de los valores proporcionados
        const findRoles = await rolesService.findRoles({ name: { $in: role } });

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
