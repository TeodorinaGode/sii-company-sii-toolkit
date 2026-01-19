import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDisplayDialogComponent } from './error-display-dialog.component';
import * as i0 from "@angular/core";
export declare class ErrorDisplayService {
    private dialog;
    constructor(dialog: MatDialog);
    /**
     * Show an error dialog ore returns the current one if already opened
     * @param errorTitle the title of the dialog
     * @param errorContent the content of the dialog
     */
    showDialog(errorTitle: string, errorContent: string): MatDialogRef<ErrorDisplayDialogComponent, any>;
    isAlreadyOpened(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorDisplayService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ErrorDisplayService>;
}
