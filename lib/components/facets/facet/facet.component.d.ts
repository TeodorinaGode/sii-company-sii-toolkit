import { SiiFacetService } from '../common/service/sii-facet.service';
import { PrimitiveFacetDirective } from '../common/primitive-facet/primitive-facet.directive';
import * as i0 from "@angular/core";
export declare class FacetComponent extends PrimitiveFacetDirective {
    facetTemplate: any;
    constructor(siiFacetService: SiiFacetService);
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetComponent, "sii-facet", never, {}, {}, ["facetTemplate"], never, true, never>;
}
