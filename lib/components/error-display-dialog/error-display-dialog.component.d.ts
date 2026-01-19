import { OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as i0 from "@angular/core";
export declare class ErrorDisplayDialogComponent implements OnInit {
    data: any;
    private location;
    errorTitle: string;
    errorContent: string;
    constructor(data: any, location: Location);
    ngOnInit(): void;
    goToHome(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorDisplayDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ErrorDisplayDialogComponent, "sii-error-display-dialog", never, {}, {}, never, never, true, never>;
}
