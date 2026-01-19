import { HttpClient } from '@angular/common/http';
import { SiiToolkitService } from '../../../../sii-toolkit.service';
import { BehaviorSubject } from 'rxjs';
import { SiiWaitService } from '../../../wait/sii-wait.service';
import { Router } from '@angular/router';
import { SiiEngageService } from '../../../../service/sii-engage.service';
import * as i0 from "@angular/core";
export declare class SdacPreviewService {
    private http;
    siiToolkitService: SiiToolkitService;
    private waitServ;
    private router;
    private es;
    get isEngage(): boolean;
    ticketPreview: BehaviorSubject<any[]>;
    notificationPreview: BehaviorSubject<any[]>;
    ticketCount: number;
    notificationCount: number;
    refreshInProgress: BehaviorSubject<boolean>;
    constructor(http: HttpClient, siiToolkitService: SiiToolkitService, waitServ: SiiWaitService, router: Router, es: SiiEngageService);
    loadSdacPreview(): void;
    openSdacTiketsByCode(ssRef?: string): void;
    openSdacType(notifica?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SdacPreviewService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SdacPreviewService>;
}
