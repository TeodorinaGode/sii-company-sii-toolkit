import { ElementRef, AfterViewInit } from '@angular/core';
import { SiiFacetService } from '../service/sii-facet.service';
import * as i0 from "@angular/core";
export declare class FacetToolbarSearchComponent implements AfterViewInit {
    siiFacetService: SiiFacetService;
    inputElement: ElementRef;
    get haveValue(): boolean;
    constructor(siiFacetService: SiiFacetService);
    private changeTxt;
    ngAfterViewInit(): void;
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetToolbarSearchComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetToolbarSearchComponent, "sii-facet-toolbar-search", never, {}, {}, never, never, true, never>;
}
