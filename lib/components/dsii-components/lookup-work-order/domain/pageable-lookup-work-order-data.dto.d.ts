import { ILookupWorkOrderDataDTO } from './lookup-work-order-data.dto';
export interface IPageableLookupWorkOrderDataDTO {
    readonly content: ILookupWorkOrderDataDTO[];
    readonly empty: boolean;
    readonly first: boolean;
    readonly last: boolean;
    readonly number: number;
    readonly numberOfElements: number;
    readonly size: number;
    readonly totalElements: number;
    readonly totalPages: number;
}
