import { ILookupOdaDataDTO } from './lookup-oda-data.dto';
export interface IPageableLookupOdaPosDataDTO {
    readonly content: ILookupOdaDataDTO[];
    readonly empty: boolean;
    readonly first: boolean;
    readonly last: boolean;
    readonly number: number;
    readonly numberOfElements: number;
    readonly size: number;
    readonly totalElements: number;
    readonly totalPages: number;
}
