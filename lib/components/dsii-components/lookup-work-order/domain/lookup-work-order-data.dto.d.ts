import { ILookupIOCdcDataBaseDTO } from './lookup-io-cdc-data.dto';
export interface ILookupWorkOrderDataDTO extends ILookupIOCdcDataBaseDTO {
    readonly cdcCodice: string;
    readonly comCp: string;
    readonly comInizioValidita: string;
}
