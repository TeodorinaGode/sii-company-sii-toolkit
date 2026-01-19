import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SiiWaitService } from '../components/wait/sii-wait.service';
import { SiiToolkitService } from '../sii-toolkit.service';
import * as i0 from "@angular/core";
export declare class SiiPingService {
    private http;
    private siiWait;
    siiToolkitService: SiiToolkitService;
    private pingInterval;
    headers: HttpHeaders;
    constructor(http: HttpClient, siiWait: SiiWaitService, siiToolkitService: SiiToolkitService);
    enable(): void;
    disable(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiPingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiPingService>;
}
