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
            subscriptions: ["subscriptions_read"],
            subscriptionDurations: ["subscription_durations_read"],
            contacts: ["contacts_read"],
            workshops:["workshops_read"]
        },
    },
    {
        method: Method.POST,
        scope: Scope.WRITE,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_create"],
            roles: ["roles_create"],
            subscriptions: ["subscriptions_create"],
            subscriptionDurations: ["subscription_durations_create"],
            contacts: ["contacts_create"],
            workshops:["workshops_create"]
        },
    },
    {
        method: Method.PUT,
        scope: Scope.UPDATE,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_update"],
            roles: ["roles_update"],
            subscriptions: ["subscriptions_update"],
            subscriptionDurations: ["subscription_durations_update"],
            contacts: ["contacts_update"],
            workshops:["workshops_update"]
        },
    },
    {
        method: Method.DELETE,
        scope: Scope.DELETE,
        permissions: ["admin_granted"],
        modulePermissions: {
            users: ["users_delete"],
            roles: ["roles_delete"],
            subscriptions: ["subscriptions_delete"],
            subscriptionDurations: ["subscription_durations_delete"],
            contacts: ["contacts_delete"],
            workshops:["workshops_delete"]
        },
    },
];
