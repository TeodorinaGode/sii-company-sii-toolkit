import { ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class BannerFeedbackOutletComponent implements AfterViewInit {
    dialogRef: MatDialogRef<BannerFeedbackOutletComponent>;
    data: any;
    el: ElementRef;
    constructor(dialogRef: MatDialogRef<BannerFeedbackOutletComponent>, data: any, el: ElementRef);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BannerFeedbackOutletComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BannerFeedbackOutletComponent, "sii-banner-feedback-outlet", never, {}, {}, never, never, true, never>;
}
