import { Params } from "types/RepositoryTypes";
import { Pagination } from "utils/ResponseHandler";

export const paginationBuilder = (params: Params, total: number): Pagination => {
    try {
        const currentPage = Number(params.page) || 1;
        const itemsPerPage = Number(params.perPage) || 10;
        const totalPages = Math.ceil(total / itemsPerPage);

        const pagination: Pagination = {
            total,
            page: currentPage,
            perPage: itemsPerPage,
            totalPages,
            prevPage: currentPage > 1 ? currentPage - 1 : null,
            nextPage: currentPage < totalPages ? currentPage + 1 : null,
        };

        return pagination;
    } catch (error) {
        return {
            total: 0,
            page: 1,
            perPage: 10,
            totalPages: 0,
            prevPage: null,
            nextPage: null,
        };
    }
};
