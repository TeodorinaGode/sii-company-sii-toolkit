import { PrimitiveFacetDirective } from '../common/primitive-facet/primitive-facet.directive';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SiiFacetOptionDto } from '../common/dto/i-sii-facet-option.dto';
import { SiiFacetService } from '../common/service/sii-facet.service';
import * as i0 from "@angular/core";
export declare class FacetCheckboxComponent extends PrimitiveFacetDirective {
    constructor(siiFacetService: SiiFacetService);
    check(opt: SiiFacetOptionDto, ev: MatCheckboxChange): void;
    toggle(opt: SiiFacetOptionDto): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetCheckboxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetCheckboxComponent, "sii-facet-checkbox", never, {}, {}, never, never, true, never>;
}
