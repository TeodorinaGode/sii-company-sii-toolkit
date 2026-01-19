import { OnInit, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BannerFeedbackComponent implements OnInit {
    el: ElementRef;
    hostClass: string;
    set type(t: any);
    constructor(el: ElementRef);
    ngOnInit(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BannerFeedbackComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BannerFeedbackComponent, "sii-banner-feedback", never, { "type": { "alias": "type"; "required": false; }; }, {}, never, ["[feedback-toolbar]", "[feedback-body]", "[feedback-action]"], true, never>;
}
