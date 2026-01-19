import { HttpClient } from '@angular/common/http';
import { SiiToolkitService } from '../../../sii-toolkit.service';
import { MatDialog } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class DelegationService {
    private http;
    private siiToolkitService;
    dialog: MatDialog;
    constructor(http: HttpClient, siiToolkitService: SiiToolkitService, dialog: MatDialog);
    logout(): void;
    openDelegation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DelegationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DelegationService>;
}
