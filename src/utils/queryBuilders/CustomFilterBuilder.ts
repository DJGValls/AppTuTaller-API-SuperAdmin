import { ParsedQs } from "qs";

export const filterBuilder = (filterParam?: string | ParsedQs | string[] | Record<string, any>): Record<string, any> => {
    if (!filterParam) return {};
    try {
        // Si es un string, intentamos parsearlo
        if (typeof filterParam === 'string') {
            // Verificar si tiene el formato [campo1,campo2]:valor
            const bracketMatch = filterParam.match(/\[(.*?)\]:(.*)/);
            if (bracketMatch) {
                const [, fields, value] = bracketMatch;
                const fieldArray = fields.split(',').map(f => f.trim());
                const filter: Record<string, any> = {};
                
                fieldArray.forEach(field => {
                    filter[field] = value;
                });
                
                return filter;
            }
            
            // Si no tiene el formato especial, intentar parsearlo como JSON
            try {
                return JSON.parse(filterParam);
            } catch {
                return {};
            }
        }
        
        // Si es un objeto ParsedQs o Record
        if (typeof filterParam === 'object' && !Array.isArray(filterParam)) {
            const filter: Record<string, any> = {};
            
            Object.entries(filterParam).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    filter[key] = value;
                } else if (Array.isArray(value)) {
                    filter[key] = { $in: value };
                } else if (typeof value === 'object' && value !== null) {
                    filter[key] = value;
                }
            });
            return filter;
        }
        return {};
    } catch (error) {
        console.error('Error building filter query:', error);
        return {};
    }
};