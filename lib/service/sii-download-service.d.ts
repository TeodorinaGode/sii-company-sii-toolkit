import { HttpClient } from '@angular/common/http';
import { SiiWaitService } from '../components/wait/sii-wait.service';
import { SiiToolkitService } from '../sii-toolkit.service';
import { SiiDownloadItemDTO } from '../dto/i-sii-download.dto';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class SiiDownloadService {
    private http;
    siiToolkitService: SiiToolkitService;
    private waitServ;
    private appRef;
    servToCall: Observable<SiiDownloadItemDTO[]>;
    utils: {
        count: number;
        list: SiiDownloadItemDTO[];
        fetchInProgress: number;
        someChanges: boolean;
        countChange: boolean;
        refreshPollInProgress: boolean;
    };
    constructor(http: HttpClient, siiToolkitService: SiiToolkitService, waitServ: SiiWaitService, appRef: string);
    _fetchData(): void;
    _delete(attach: SiiDownloadItemDTO): void;
    _markReadyForDelete(attach: SiiDownloadItemDTO): void;
    _clearReadyForTimeout(attach: any): void;
    _download(id: any): void;
    refresh(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiDownloadService, [null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiDownloadService>;
}
