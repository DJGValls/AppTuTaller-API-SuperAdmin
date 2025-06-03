import { ParsedQs } from "qs";
export const populateBuilder = (populateParam?: string | ParsedQs | (string | ParsedQs)[] | undefined): string[] => {
    if (!populateParam) return [];
    
    // Convertir el parámetro a string si es posible
    const populateString = Array.isArray(populateParam) 
        ? populateParam[0]?.toString() 
        : populateParam.toString();
    
    if (!populateString) return [];
    try {
        // Dividir el string por comas y limpiar espacios en blanco
        const populateFields = populateString
            .split(',')
            .map(field => field.trim())
            .filter(field => field.length > 0);
        
        return populateFields;
    } catch (error) {
        console.error('Error building populate query:', error);
        return [];
    }
};