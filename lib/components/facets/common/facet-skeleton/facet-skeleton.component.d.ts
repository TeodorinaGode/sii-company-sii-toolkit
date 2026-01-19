import { OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FacetSkeletonComponent implements OnInit, AfterViewInit {
    expanded: boolean;
    expandedChange: EventEmitter<any>;
    label: string;
    initalized: boolean;
    constructor();
    ngAfterViewInit(): void;
    ngOnInit(): void;
    setLabel(label: string): void;
    setExpanded(expanded: boolean): void;
    expChange(ev: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetSkeletonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetSkeletonComponent, "sii-facet-skeleton", never, { "expanded": { "alias": "expanded"; "required": false; }; "label": { "alias": "label"; "required": false; }; }, { "expandedChange": "expandedChange"; }, never, ["sii-facet-search", "*", "sii-facet-paginator"], true, never>;
}
