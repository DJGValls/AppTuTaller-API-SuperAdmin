export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    statusCode: number;
    pagination?: Pagination
}

export interface Pagination {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    prevPage: number | null;
    nextPage: number | null;
}

export class ResponseHandler {
    static success<T>(data: T, message: string, statusCode: number = 200): ApiResponse<T> {
        return {
            success: true,
            message,
            statusCode,
            data,
        };
    }

    //success de paginacion
    static paginationSuccess<T>(data: T, pagination: Pagination, message: string, statusCode: number = 200): ApiResponse<T> {
        return {
            success: true,
            message,
            statusCode,
            data,
            pagination,
        };
    }

    static error<T>(error: string, message: string = "Error del servidor", statusCode: number = 500): ApiResponse<T> {
        return {
            success: false,
            error,
            message,
            statusCode,
        };
    }
    static badRequest(message: string = "Solicitud incorrecta", statusCode: 400): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static notFound(message: string = "Recurso no encontrado", statusCode: 404): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static unauthorized(message: string = "No autorizado", statusCode: 401): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static forbidden(message: string = "Prohibido", statusCode: 403): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static internalServerError(
        statusCode: 500,
        message: string | undefined = "Error desconocido del servidor"
    ): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static notImplemented(message: string = "No implementado", statusCode: 501): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static serviceUnavailable(message: string = "Servicio no disponible", statusCode: 503): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static gatewayTimeout(message: string = "Tiempo de espera agotado", statusCode: 504): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static tooManyRequests(message: string = "Demasiadas solicitudes", statusCode: 429): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static badGateway(message: string = "Puerta de enlace incorrecta", statusCode: 502): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static networkAuthenticationRequired(
        message: string = "Autenticación de red requerida",
        statusCode: 511
    ): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static paymentRequired(message: string = "Pago requerido", statusCode: 402): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static requestTimeout(message: string = "Tiempo de solicitud agotado", statusCode: 408): ApiResponse<null> {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }

    static handleMongooseError(error: any): ApiResponse<null> {
        if (error.name === "CastError") {
            return {
                success: false,
                error: "ID inválido",
                message: `El ID proporcionado no es válido: ${error.value}`,
                statusCode: 400,
            };
        }
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return {
                success: false,
                error: "Error de validación",
                message: errors.join(", "),
                statusCode: 400,
            };
        }
        // Error de Mongoose genérico
        return {
            success: false,
            error: "Error de base de datos",
            message: error.message || "Error interno del servidor",
            statusCode: 500,
        };
    }
}
