import { Method, Scope } from "enums/Permissions.enums";

interface ModulePermissions {
    users?: string[];
    roles?: string[];
    [key: string]: string[] | undefined;
}
interface Permission {
    method: Method;
    scope: Scope;
    permissions: string[];
    modulePermissions: ModulePermissions;
}

export const permissions: Permission[] = [
    {
        method: Method.GET,
        scope: Scope.READ,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_read"],
            roles: ["roles_read"],
        },
    },
    {
        method: Method.POST,
        scope: Scope.WRITE,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_create"],
            roles: ["roles_create"],
        },
    },
    {
        method: Method.PUT,
        scope: Scope.UPDATE,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_update"],
            roles: ["roles_update"],
        },
    },
    {
        method: Method.DELETE,
        scope: Scope.DELETE,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_delete"],
            roles: ["roles_delete"],
        },
    },
];
