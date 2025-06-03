import { Query } from "types/RepositoryTypes";
import { ParsedQs } from "qs";
export const sortsBuilder = (sortParam?: string | ParsedQs | (string | ParsedQs)[] | undefined): Query => {
    if (!sortParam) return {};
    
    // Convertir el parámetro a string si es posible
    const sortString = Array.isArray(sortParam) 
        ? sortParam[0]?.toString() 
        : sortParam.toString();
    if (!sortString) return {};
    try {
        const sortParams = sortString.split(',').map(param => param.trim());
        const sortQuery: Record<string, 1 | -1> = {};
        
        sortParams.forEach(param => {
            const isDesc = param.startsWith('-');
            const field = isDesc ? param.substring(1) : param;
            sortQuery[field] = isDesc ? -1 : 1;
        });
        
        return { sort: sortQuery };
    } catch (error) {
        console.error('Error building sort query:', error);
        return {};
    }
};