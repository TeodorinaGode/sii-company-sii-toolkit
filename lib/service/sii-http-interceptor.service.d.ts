import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorDisplayService } from '../components/error-display-dialog/error-display.service';
import { SiiWaitService } from '../components/wait/sii-wait.service';
import * as i0 from "@angular/core";
export declare class SiiHttpInterceptorService implements HttpInterceptor {
    private errorDisplay;
    private wait;
    static HIDE_ERROR: string;
    lastRequestTime: number;
    constructor(errorDisplay: ErrorDisplayService, wait: SiiWaitService);
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any>;
    private handleError;
    reloadPageAfterSessioExpired(): void;
    resetSessionTimeout(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiHttpInterceptorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiHttpInterceptorService>;
}
