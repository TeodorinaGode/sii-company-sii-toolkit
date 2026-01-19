import { PrimitiveFacetDirective } from '../common/primitive-facet/primitive-facet.directive';
import { SiiFacetService } from '../common/service/sii-facet.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as i0 from "@angular/core";
export declare class FacetSingleToggleComponent extends PrimitiveFacetDirective {
    label: any;
    set target(val: string);
    constructor(siiFacetService: SiiFacetService);
    onToggleChange(ev: MatSlideToggleChange): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetSingleToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetSingleToggleComponent, "sii-facet-single-toggle", never, { "label": { "alias": "label"; "required": false; }; "target": { "alias": "target"; "required": false; }; }, {}, never, never, true, never>;
}
