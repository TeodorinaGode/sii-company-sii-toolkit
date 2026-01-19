import { ILookupCdcDataDTO } from './lookup-cdc-data.dto';
export interface IPageableLookupCdcDataDTO {
    readonly content: ILookupCdcDataDTO[];
    readonly empty: boolean;
    readonly first: boolean;
    readonly last: boolean;
    readonly number: number;
    readonly numberOfElements: number;
    readonly size: number;
    readonly totalElements: number;
    readonly totalPages: number;
}
