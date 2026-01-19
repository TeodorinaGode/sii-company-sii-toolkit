import { TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
export declare class SiiFeedbackService {
    private snackBar;
    dialog: MatDialog;
    constructor(snackBar: MatSnackBar, dialog: MatDialog);
    showSuccessFeedback(templateRef: TemplateRef<any>, config?: MatSnackBarConfig<any>): MatSnackBarRef<any>;
    showErrorFeedback(templateRef: TemplateRef<any>, config?: MatSnackBarConfig<any>): MatSnackBarRef<any>;
    showInfoFeedback(templateRef: TemplateRef<any>, config?: MatSnackBarConfig<any>): MatSnackBarRef<any>;
    showSuccessToastFeedback(templateRef: TemplateRef<any>, config?: MatSnackBarConfig<any>): MatSnackBarRef<any>;
    showErrorToastFeedback(templateRef: TemplateRef<any>, config?: MatSnackBarConfig<any>): MatSnackBarRef<any>;
    showInfoToastFeedback(templateRef: TemplateRef<any>, config?: MatSnackBarConfig<any>): MatSnackBarRef<any>;
    showSuccessBanner(templateRef: TemplateRef<any> | ComponentType<any>, config?: MatDialogConfig<any>): import("@angular/material/dialog").MatDialogRef<any, any>;
    showErrorBanner(templateRef: TemplateRef<any> | ComponentType<any>, config?: MatDialogConfig<any>): import("@angular/material/dialog").MatDialogRef<any, any>;
    showInfoBanner(templateRef: TemplateRef<any> | ComponentType<any>, config?: MatDialogConfig<any>): import("@angular/material/dialog").MatDialogRef<any, any>;
    private showFeedback;
    private showToastFeedback;
    private showFeedbackBanner;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiFeedbackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiFeedbackService>;
}
