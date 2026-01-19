import { OnInit, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SnackbarFeedbackComponent implements OnInit {
    el: ElementRef;
    action: string;
    constructor(el: ElementRef);
    ngOnInit(): void;
    doClickAction(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SnackbarFeedbackComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SnackbarFeedbackComponent, "sii-snackbar-feedback", never, { "action": { "alias": "action"; "required": false; }; }, {}, never, ["*"], true, never>;
}
