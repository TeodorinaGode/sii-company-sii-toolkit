import { OnInit, ElementRef, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PageFiltersComponent implements OnInit {
    el: ElementRef;
    defaultMinWidth: string;
    hostWidth: string;
    display: string;
    toolbarTitle: string;
    filterIcon: string;
    set width(val: any);
    closeFilterPanelEmitter: EventEmitter<any>;
    constructor(el: ElementRef);
    ngOnInit(): void;
    get isOpen(): boolean;
    getRealWidth(): number;
    getMinWidthInPx(): number;
    hoverFullScreen(status: boolean): void;
    hover(status: boolean): void;
    closePanel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PageFiltersComponent, "sii-page-filters", never, { "toolbarTitle": { "alias": "toolbarTitle"; "required": false; }; "filterIcon": { "alias": "filterIcon"; "required": false; }; "width": { "alias": "width"; "required": false; }; }, {}, never, ["sii-breadcrumb", "*"], true, never>;
}
