
export type Query = Record<string, unknown>;

export interface Params  {
    sort?: {
        field: string,
        order: 1 | -1
    }
}

export interface Repository<T = unknown> {
    find(query?: Query, params?: Params): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
