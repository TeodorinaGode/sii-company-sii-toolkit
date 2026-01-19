import { HttpClient } from '@angular/common/http';
import { AfterViewInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObservableInput } from 'rxjs';
import { ILookupOdaDataDTO } from '../../domain/lookup-oda-data.dto';
import { IPageableLookupOdaPosDataDTO } from '../../domain/pageable-lookup-oda-pos-data.dto';
import { SiiToolkitService } from '../../../../../sii-toolkit.service';
import * as i0 from "@angular/core";
export declare class SearchOdaPosDialogComponent implements AfterViewInit {
    dialogRef: MatDialogRef<SearchOdaPosDialogComponent>;
    siiToolkitService: SiiToolkitService;
    http: HttpClient;
    data: ISearchOdaPosDialogComponentData;
    odaposPaginator: MatPaginator;
    odaposSort: MatSort;
    odaposFormControl: UntypedFormControl;
    odaposDisplayedColumns: string[];
    odaposDataSource: MatTableDataSource<ILookupOdaDataDTO>;
    odaposResultsLength: number;
    constructor(dialogRef: MatDialogRef<SearchOdaPosDialogComponent>, siiToolkitService: SiiToolkitService, http: HttpClient, data: ISearchOdaPosDialogComponentData);
    ngAfterViewInit(): void;
    updateOdaposData(data: IPageableLookupOdaPosDataDTO): void;
    fetchOdaposDataFromServer(): ObservableInput<IPageableLookupOdaPosDataDTO>;
    selectOdaposRow(row: ILookupOdaDataDTO, event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SearchOdaPosDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SearchOdaPosDialogComponent, "sii-search-oda-pos-dialog", never, {}, {}, never, never, true, never>;
}
interface ISearchOdaPosDialogComponentData {
    codSociety: string;
    codSupplier: string;
    lavMatricola: string;
    tipologie: string;
}
export {};
