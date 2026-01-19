import { OnInit, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FacetPaginatorComponent implements OnInit {
    size: number;
    visibleFacetsSize: number;
    multiplicityToDisplay: number;
    multiplicityToDisplayChange: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    updateVal(incr: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetPaginatorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetPaginatorComponent, "sii-facet-paginator", never, { "size": { "alias": "size"; "required": false; }; "visibleFacetsSize": { "alias": "visibleFacetsSize"; "required": false; }; "multiplicityToDisplay": { "alias": "multiplicityToDisplay"; "required": false; }; }, { "multiplicityToDisplayChange": "multiplicityToDisplayChange"; }, never, never, true, never>;
}
