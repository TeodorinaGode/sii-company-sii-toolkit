import { HttpClient } from '@angular/common/http';
import { AfterViewInit, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { ILookupCdcDataDTO } from '../../domain/lookup-cdc-data.dto';
import { ILookupWorkOrderDataDTO } from '../../domain/lookup-work-order-data.dto';
import { IPageableLookupCdcDataDTO } from '../../domain/pageable-lookup-cdc-data.dto.';
import { IPageableLookupWorkOrderDataDTO } from '../../domain/pageable-lookup-work-order-data.dto';
import { SiiToolkitService } from '../../../../../sii-toolkit.service';
import * as i0 from "@angular/core";
export declare class SearchWorkOrderDialogComponent implements OnInit, AfterViewInit {
    dialogRef: MatDialogRef<SearchWorkOrderDialogComponent>;
    siiToolkitService: SiiToolkitService;
    http: HttpClient;
    data: ISearchWorkOrderDialogComponentData;
    internalOrderPaginator: MatPaginator;
    internalOrderSort: MatSort;
    cdcPaginator: MatPaginator;
    cdcSort: MatSort;
    internalOrderFormControl: UntypedFormControl;
    internalOrderDisplayedColumns: string[];
    internalOrderDataSource: MatTableDataSource<ILookupWorkOrderDataDTO>;
    internalOrderResultsLength: number;
    cdcFormControl: UntypedFormControl;
    cdcDisplayedColumns: string[];
    cdcDataSource: MatTableDataSource<ILookupCdcDataDTO>;
    cdcResultsLength: number;
    utils: {
        ioActivated: boolean;
        cdcActivated: boolean;
    };
    constructor(dialogRef: MatDialogRef<SearchWorkOrderDialogComponent>, siiToolkitService: SiiToolkitService, http: HttpClient, data: ISearchWorkOrderDialogComponentData);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    activateSubscribes(tabIndex: number): void;
    tabChange(val: MatTabChangeEvent): void;
    updateInternalOrderData(data: IPageableLookupWorkOrderDataDTO): void;
    updateCdcData(data: IPageableLookupCdcDataDTO): void;
    fetchInternalOrderDataFromServer(): Observable<IPageableLookupWorkOrderDataDTO>;
    fetchCdcDataFromServer(): Observable<IPageableLookupCdcDataDTO>;
    selectInternalOrderRow(row: ILookupWorkOrderDataDTO, event: MouseEvent): void;
    selectCdcRow(row: ILookupCdcDataDTO, event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SearchWorkOrderDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SearchWorkOrderDialogComponent, "sii-search-work-order-dialog", never, {}, {}, never, never, true, never>;
}
interface ISearchWorkOrderDialogComponentData {
    codSociety: string;
    hideCdc: boolean;
    hideIO: boolean;
    customPageableIORestFunct: (txt: string, page: number, size: number, sortField: string, sortDirection: string) => Observable<IPageableLookupWorkOrderDataDTO>;
    customPageableCdcRestFunct: (txt: string, page: number, size: number, sortField: string, sortDirection: string) => Observable<IPageableLookupCdcDataDTO>;
}
export {};
