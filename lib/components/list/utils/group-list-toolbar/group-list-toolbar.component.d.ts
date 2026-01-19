import { AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CisGroup, SiiGroupedInfiniteScrollDataSource } from '../../grouped-infinite-scroll/utils/sii-grouped-infinite-scroll-data-source';
import * as i0 from "@angular/core";
export declare class GroupListToolbarComponent implements AfterViewInit {
    private sanitizer;
    private el;
    ds: SiiGroupedInfiniteScrollDataSource;
    group: CisGroup;
    prev: string;
    utils: {
        plt: any;
        lt: any;
    };
    constructor(sanitizer: DomSanitizer, el: ElementRef);
    ngAfterViewInit(): void;
    evaluateTop(): void;
    toggleGroup(): void;
    toggleParentGroup(): void;
    refresh(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GroupListToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GroupListToolbarComponent, "sii-group-list-toolbar", never, { "ds": { "alias": "ds"; "required": false; }; "group": { "alias": "group"; "required": false; }; }, {}, never, never, true, never>;
}
