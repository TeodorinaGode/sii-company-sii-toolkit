import { ElementRef, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PageDetailComponent implements OnInit {
    el: ElementRef;
    defaultMinWidth: string;
    hostWidth: string;
    display: string;
    alwaysHover: boolean;
    set width(val: any);
    constructor(el: ElementRef);
    ngOnInit(): void;
    getRealWidth(): number;
    getMinWidthInPx(): number;
    hoverFullScreen(status: boolean): void;
    hover(status: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageDetailComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PageDetailComponent, "sii-page-detail", never, { "alwaysHover": { "alias": "alwaysHover"; "required": false; }; "width": { "alias": "width"; "required": false; }; }, {}, never, ["*"], true, never>;
}
