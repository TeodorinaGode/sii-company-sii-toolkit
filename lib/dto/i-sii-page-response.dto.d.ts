export type ISiiPageResponseDTO<T> = {
    data: Array<T>;
    count: number;
    lastEvaluatedKey?: any;
    pageSize?: number;
    currPage?: number;
    maxPage?: number;
};
