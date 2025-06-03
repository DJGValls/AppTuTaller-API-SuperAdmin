import { UserRepository } from "repositories/userRepositories";
import { UserService } from "services/userService";
import { InterfaceUserRepository, User } from "types/UserTypes";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { permissions } from "types/PermissionTypes";
import { Method } from "enums/Permissions.enums";
import { ResponseHandler } from "utils/ResponseHandler";

const userRepository: InterfaceUserRepository = new UserRepository();
const userService = new UserService(userRepository);

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers.authorization?.replace(/^Bearer\s+/, "") as string;
    try {
        const verify = jwt.verify(token, jwtSecret) as User;
        const getUser = await userService.findUserById(verify.id);
        if (!getUser) {
            res.status(401).json(ResponseHandler.unauthorized("Usuario no encontrado", 401));
            return;
        }
        req.currentUser = getUser;
        next();
    } catch (error: any) {
        console.error(error.message);
        res.status(401).json(ResponseHandler.unauthorized("Token inválido o expirado", 401));
        return;
    }
};

export const getPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentUser, method, originalUrl } = req;
        if (!currentUser) {
            res.status(401).json(ResponseHandler.unauthorized("Usuario no autorizado", 401));
            return;
        }
        // Asignamos a 'roles' la información obtenida en currentUser.
        const roles = currentUser.roles;

        // Se extrae el primer segmento de la ruta (originalUrl) mediante una regex
        // Por ejemplo, si originalUrl es "/module/accion", currentModule tomará "module".
        const currentModule = originalUrl.replace(/^\/api\/([^\/\?]+).*/, "$1");

        // Buscamos en el arreglo 'permissions' el objeto cuyo método coincida con el método HTTP de la solicitud.
        // Se utiliza la conversión de 'method' a través del enum (o mapeo) 'Method'.
        const findMethod = permissions.find(
            (permission) => permission.method === Method[method as keyof typeof Method]
        );

        // Verificamos si en el objeto encontrado (findMethod) ya existe un permiso específico
        // formado por el módulo actual y el scope del método (por ejemplo: "module_scope").
        // Si no existe, se agrega a la lista de permisos.
        if (!findMethod?.permissions.includes(`${currentModule}_${findMethod.scope}`)) {
            findMethod?.permissions.push(`${currentModule}_${findMethod.scope}`);
        }

        // Se obtienen los permisos de todos los roles asociados al usuario.
        // Se emplea 'flatMap' para unir y aplanar los arrays de permisos de cada rol,
        // y se utiliza 'Set' para evitar que existan permisos duplicados.
        const mergedRolesPermissions = roles
            ? [
                  ...new Set(
                      roles.flatMap((role: { permissions: string[] }) => {
                          return role.permissions;
                      })
                  ),
              ]
            : [];

        // Se declara el array para almacenar los permisos finales del usuario.
        let userPermissions: string[] = [];

        // Si currentUser ya tiene permisos asignados directamente y no está vacío,
        // se utilizan esos permisos.
        if (currentUser.permissions?.length !== 0) {
            userPermissions = currentUser.permissions!;
        } else {
            // En caso contrario, se asignan los permisos obtenidos a partir de los roles.
            userPermissions = mergedRolesPermissions as string[];
        }

        // Se verifica si alguno de los permisos requeridos (en findMethod.permissions)
        // está presente en los permisos del usuario (userPermissions).
        // El método 'find' devolverá el primer permiso que cumpla la condición.
        const permissionsGranted =
            userPermissions.includes("admin_granted") ||
            findMethod?.modulePermissions?.[currentModule]?.some((permission) => userPermissions.includes(permission));

        // Si no se encontró ningún permiso que autorice el acceso, se responde con un estado 401 (Unauthorized).
        if (!permissionsGranted) {
            res.status(403).json(ResponseHandler.forbidden("No tienes permisos suficientes", 403));
            return;
        }

        // Si la verificación de permisos es superada, se continúa con la siguiente función middleware.
        next();
    } catch (error) {
        res.status(500).json(ResponseHandler.internalServerError(500, "Error en la verificación de permisos"));
        return;
    }
};
