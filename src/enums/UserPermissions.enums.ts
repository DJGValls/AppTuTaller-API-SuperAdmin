export enum UserPermissionsEnum {
    // Permisos de Super Admin
    ADMIN_GRANTED = "admin_granted",
    SYSTEM_ADMIN = "system_admin",
    
    // Permisos de Usuarios
    USERS_READ = "users_read",
    USERS_CREATE = "users_create",
    USERS_UPDATE = "users_update",
    USERS_DELETE = "users_delete",
    
    // Permisos de Roles
    ROLES_READ = "roles_read",
    ROLES_CREATE = "roles_create",
    ROLES_UPDATE = "roles_update",
    ROLES_DELETE = "roles_delete",
    
    // Permisos de Workshops
    WORKSHOPS_READ = "workshops_read",
    WORKSHOPS_CREATE = "workshops_create",
    WORKSHOPS_UPDATE = "workshops_update",
    WORKSHOPS_DELETE = "workshops_delete",
    WORKSHOPS_MANAGE = "workshops_manage",
    
    // Permisos de Contactos
    CONTACTS_READ = "contacts_read",
    CONTACTS_CREATE = "contacts_create",
    CONTACTS_UPDATE = "contacts_update",
    CONTACTS_DELETE = "contacts_delete",
    
    // Permisos de Órdenes de Reparación
    REPARATION_ORDERS_READ = "reparation_orders_read",
    REPARATION_ORDERS_CREATE = "reparation_orders_create",
    REPARATION_ORDERS_UPDATE = "reparation_orders_update",
    REPARATION_ORDERS_DELETE = "reparation_orders_delete",
    
    // Permisos de Tareas de Reparación
    REPARATION_TASKS_READ = "reparation_tasks_read",
    REPARATION_TASKS_CREATE = "reparation_tasks_create",
    REPARATION_TASKS_UPDATE = "reparation_tasks_update",
    REPARATION_TASKS_DELETE = "reparation_tasks_delete",
    
    // Permisos de Suscripciones
    SUBSCRIPTIONS_READ = "subscriptions_read",
    SUBSCRIPTIONS_CREATE = "subscriptions_create",
    SUBSCRIPTIONS_UPDATE = "subscriptions_update",
    SUBSCRIPTIONS_DELETE = "subscriptions_delete",
    
    // Permisos de Duraciones de Suscripción
    SUBSCRIPTION_DURATIONS_READ = "subscription_durations_read",
    SUBSCRIPTION_DURATIONS_CREATE = "subscription_durations_create",
    SUBSCRIPTION_DURATIONS_UPDATE = "subscription_durations_update",
    SUBSCRIPTION_DURATIONS_DELETE = "subscription_durations_delete",
    
    // Permisos de Citas (Appointments)
    APPOINTMENTS_READ = "appointments_read",
    APPOINTMENTS_CREATE = "appointments_create",
    APPOINTMENTS_UPDATE = "appointments_update",
    APPOINTMENTS_DELETE = "appointments_delete",
    APPOINTMENTS_MANAGE = "appointments_manage", // confirmar, cancelar, iniciar, completar
    APPOINTMENTS_VIEW_AVAILABILITY = "appointments_view_availability",
    
    // Permisos de Horarios de Taller (Workshop Schedules)
    WORKSHOP_SCHEDULES_READ = "workshop_schedules_read",
    WORKSHOP_SCHEDULES_CREATE = "workshop_schedules_create",
    WORKSHOP_SCHEDULES_UPDATE = "workshop_schedules_update",
    WORKSHOP_SCHEDULES_DELETE = "workshop_schedules_delete",
    WORKSHOP_SCHEDULES_MANAGE = "workshop_schedules_manage",
    
    // Permisos especiales
    VIEW_ALL_WORKSHOPS = "view_all_workshops",
    MANAGE_PAYMENTS = "manage_payments",
    VIEW_ANALYTICS = "view_analytics",
    MANAGE_WORKSHOP_SETTINGS = "manage_workshop_settings",
}

export const getAllPermissions = (): string[] => {
    return Object.values(UserPermissionsEnum);
};

export const validatePermission = (permission: string): boolean => {
    return getAllPermissions().includes(permission);
};

export const validatePermissions = (permissions: string[]): { valid: string[], invalid: string[] } => {
    const allPermissions = getAllPermissions();
    const valid = permissions.filter(p => allPermissions.includes(p));
    const invalid = permissions.filter(p => !allPermissions.includes(p));
    return { valid, invalid };
};
