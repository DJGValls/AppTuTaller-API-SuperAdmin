import { SortOptions, PaginationOptions } from "types/RepositoryTypes";
import { PopulateBuilder } from "utils/PopulateBuilder";

export function FilterBuilder(query: any): {
    filter: any;
    sort: SortOptions;
    pagination: PaginationOptions;
    populate: string[];
} {
    const filter: any = {};
    const sort: SortOptions = {};
    const pagination: PaginationOptions = {
        page: 1,
        limit: 10,
    };
    let populate: string[] = [];

    if (!query) return { filter, sort, pagination, populate };

    if (query.populate) {
        populate = PopulateBuilder(query.populate);
    }
    
    // Procesar paginación
    if (query.page) {
        pagination.page = parseInt(query.page);
    }
    if (query.limit) {
        pagination.limit = parseInt(query.limit);
    }

    // Procesar filtros en formato filter[field]=value
    Object.keys(query).forEach((key) => {
        if (key === "sort") {
            // Procesar parámetros de ordenamiento
            const sortParams = query[key].split(",");
            sortParams.forEach((param: string) => {
                const [field, order] = param.split(":");
                sort[field] = order?.toLowerCase() === "desc" ? "desc" : "asc";
            });
            return;
        }
        if (key === "page" || key === "limit") {
            return;
        }
        const matches = key.match(/^filter\[(.*?)\]$/);
        if (matches) {
            const fieldName = matches[1];
            const value = query[key];

            // Manejar arrays (e.g., permissions)
            if (Array.isArray(value)) {
                filter[fieldName] = { $in: value };
            }
            // Manejar strings con búsqueda case-insensitive
            else if (typeof value === "string") {
                filter[fieldName] = new RegExp(value, "i");
            }
            // Otros tipos de valores
            else {
                filter[fieldName] = value;
            }
        }
    });
    return { filter, sort, pagination, populate };
}
