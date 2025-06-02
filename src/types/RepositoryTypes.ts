export type Query = Record<string, unknown>;

export interface SortOptions {
    [key: string]: "asc" | "desc";
}
export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    items: T[];
}

export interface Repository<T = unknown> {
    find(query?: Query, sort?: SortOptions, pagination?: PaginationOptions, populate?: string[]): Promise<PaginatedResponse<T>>;
    findById(id: string): Promise<T | null>;
    create(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
