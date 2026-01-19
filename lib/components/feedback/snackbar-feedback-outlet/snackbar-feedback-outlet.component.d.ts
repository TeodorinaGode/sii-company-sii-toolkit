import { OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import * as i0 from "@angular/core";
export declare class SnackbarFeedbackOutletComponent implements OnInit, AfterViewInit {
    data: any;
    snackBarRef: MatSnackBarRef<SnackbarFeedbackOutletComponent>;
    el: ElementRef;
    constructor(data: any, snackBarRef: MatSnackBarRef<SnackbarFeedbackOutletComponent>, el: ElementRef);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    doClickAction(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SnackbarFeedbackOutletComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SnackbarFeedbackOutletComponent, "sii-snackbar-feedback-outlet", never, {}, {}, never, never, true, never>;
}
