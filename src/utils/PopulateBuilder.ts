

export function PopulateBuilder(populate: string | undefined): string[] {
    if (!populate) return [];
    
    // Dividir la cadena por comas y filtrar valores vacíos
    return populate.split(',').filter(field => field.trim().length > 0);
}