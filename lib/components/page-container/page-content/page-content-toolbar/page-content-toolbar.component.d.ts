import { BreakpointObserver } from '@angular/cdk/layout';
import { OnInit, ElementRef } from '@angular/core';
import { PageFiltersComponent } from '../../page-filters/page-filters.component';
import * as i0 from "@angular/core";
export declare class PageContentToolbarComponent implements OnInit {
    el: ElementRef;
    breakpointObserver: BreakpointObserver;
    filtersCount: any;
    hideCount: boolean;
    itemsCount: any;
    itemsCountLabel: string;
    autoHide: boolean;
    filterIcon: string;
    siiRef: number;
    isMobile: boolean;
    constructor(el: ElementRef, breakpointObserver: BreakpointObserver);
    toggleFilterPanelRef: any;
    filterPanelRef: PageFiltersComponent;
    ngOnInit(): void;
    doToggle(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageContentToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PageContentToolbarComponent, "sii-page-content-toolbar", never, { "filtersCount": { "alias": "filtersCount"; "required": false; }; "hideCount": { "alias": "hideCount"; "required": false; }; "itemsCount": { "alias": "itemsCount"; "required": false; }; "itemsCountLabel": { "alias": "itemsCountLabel"; "required": false; }; "autoHide": { "alias": "autoHide"; "required": false; }; "filterIcon": { "alias": "filterIcon"; "required": false; }; }, {}, never, ["sii-breadcrumb", "[siiPageContentToolbarBegin]", "sii-list-select-all", "sii-list-sorter", "*"], true, never>;
}
