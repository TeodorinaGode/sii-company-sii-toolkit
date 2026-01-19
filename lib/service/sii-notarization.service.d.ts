import { TemplateRef } from '@angular/core';
import { SiiToolkitService } from '../sii-toolkit.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';
import { SiiNotarizationResponse } from '../dto/notarization-response.dto';
import { SiiFeedbackService } from './sii-feedback.service';
import * as i0 from "@angular/core";
export declare class SiiNotarizationService {
    dialog: MatDialog;
    siiToolkitService: SiiToolkitService;
    private feedbackService;
    constructor(dialog: MatDialog, siiToolkitService: SiiToolkitService, feedbackService: SiiFeedbackService);
    notarize(notarizationComponent: ComponentType<any> | TemplateRef<any>, notarizationRestService: Observable<SiiNotarizationResponse>, notarizationPrintReceiptUrl: string, config?: MatDialogConfig<any>): Subject<SiiNotarizationResponse>;
    private showNotarizationResponse;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiNotarizationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiNotarizationService>;
}
