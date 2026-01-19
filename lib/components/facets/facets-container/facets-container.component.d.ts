import { EventEmitter, AfterViewInit } from '@angular/core';
import { SiiFacetService, FacetChangesDto } from '../common/service/sii-facet.service';
import { SiiFacetOptionDto } from '../common/dto/i-sii-facet-option.dto';
import { SiiListController } from '../../../service/sii-list-controller.service';
import * as i0 from "@angular/core";
export declare class FacetsContainerComponent implements AfterViewInit {
    siiFacetService: SiiFacetService;
    siiListController: SiiListController;
    facetsChange: EventEmitter<FacetChangesDto>;
    hideToolbarSearch: boolean;
    objectKeys: {
        (o: object): string[];
        (o: {}): string[];
    };
    utils: {
        loaded: boolean;
    };
    constructor(siiFacetService: SiiFacetService, siiListController: SiiListController);
    ngAfterViewInit(): void;
    facetsSelectionChange(facets: FacetChangesDto): void;
    facetsSelectionReset(facets: FacetChangesDto): void;
    removeSelectionFromSelectionSummary(name: any, option: SiiFacetOptionDto): void;
    removeAllFilters(): void;
    get count(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetsContainerComponent, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetsContainerComponent, "sii-facets-container", never, { "hideToolbarSearch": { "alias": "hideToolbarSearch"; "required": false; }; }, { "facetsChange": "facetsChange"; }, never, ["*"], true, never>;
}
