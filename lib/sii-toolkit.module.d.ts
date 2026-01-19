import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class SiiToolkitModule {
    private dialog;
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer, dialog: MatDialog);
    checkIfOldBrowser(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiToolkitModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SiiToolkitModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SiiToolkitModule>;
}
