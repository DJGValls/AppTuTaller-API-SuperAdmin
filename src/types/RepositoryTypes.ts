
export type Query = Record<string, unknown>;

export interface Params {
    sort?: Record<string, 1 | -1>,
    populate?: string[],
    filter?: {
        [key: string]: string | string[] | Record<string, string | string[]>
    },
    all?: string,
    perPage?: string,
    page?: string,
}

export interface Repository<T = unknown> {
    find(query?: Query, params?: Params): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
