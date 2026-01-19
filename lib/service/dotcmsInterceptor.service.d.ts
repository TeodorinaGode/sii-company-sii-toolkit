import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SiiEnvironment } from '../dto/sii-environment.dto';
import * as i0 from "@angular/core";
export declare class DotCmsInterceptorService implements HttpInterceptor {
    private router;
    private environment;
    get engageBEDomain(): string;
    constructor(router: Router, environment: SiiEnvironment);
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any>;
    private handleError;
    static ɵfac: i0.ɵɵFactoryDeclaration<DotCmsInterceptorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DotCmsInterceptorService>;
}
