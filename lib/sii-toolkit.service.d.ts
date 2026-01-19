import { InjectionToken } from '@angular/core';
import { SiiEnvironment } from './dto/sii-environment.dto';
import { HttpClient } from '@angular/common/http';
import { MyselfDTO } from './dto/myself.dto';
import { HelpPageDTO } from './dto/help-page.dto';
import { Observable, BehaviorSubject } from 'rxjs';
import { WorkerContactInformationDto } from './dto/i-worker-contact-information.dto';
import * as i0 from "@angular/core";
export declare const SII_ENVIRONMENT: InjectionToken<SiiEnvironment>;
export declare const SII_SESSION_WAITING: InjectionToken<Promise<void>>;
export declare const SII_APP_REF: InjectionToken<SiiEnvironment>;
export declare class SiiToolkitService {
    private http;
    environment: SiiEnvironment;
    loggedUser: BehaviorSubject<MyselfDTO>;
    get isServerless(): boolean;
    constructor(http: HttpClient, environment: SiiEnvironment, ssw: any);
    initializeMySelf(): () => Promise<any>;
    loadMyself(force?: boolean): void;
    clearLocalstorageIfLanguageChange(currUserLang: string): void;
    findMySelf(): MyselfDTO;
    getHelpPage(functionCode: string): Observable<HelpPageDTO>;
    getWorkerContactInformation(workerId: string, serviceUrl?: string): Observable<WorkerContactInformationDto>;
    getMatDateConfig(): {
        parse: {
            dateInput: string;
        };
        display: {
            dateInput: string;
            monthYearLabel: string;
            dateA11yLabel: string;
            monthYearA11yLabel: string;
        };
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiToolkitService, [null, { optional: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiToolkitService>;
}
