import { Subject } from 'rxjs';
import { SiiFacetDto } from '../dto/i-sii-facet.dto';
import { SiiSortDTO } from '../../../../dto/i-sii-sort.dto';
import { SiiSortGroup } from '../../../../dto/i-sii-group.dto';
import * as i0 from "@angular/core";
export type FacetChangesDto = {
    facets: object;
    searchText: string;
    sort?: SiiSortDTO;
    group?: SiiSortGroup;
};
export declare class SiiFacetService {
    facetObj: {};
    facetObjForBackEnd: {};
    facetObjVal: {};
    selecteditemCount: number;
    sortField: string;
    facetLabelMap: {};
    facetsMultiplicity: {};
    facetsHideSelection: {};
    facetsExpanded: {};
    _textSerch: string;
    get haveSearchText(): boolean;
    _initFacetToSet: FacetChangesDto;
    private facetChangeSubj;
    facetChange$: import("rxjs").Observable<FacetChangesDto>;
    private facetResetSubj;
    facetReset$: import("rxjs").Observable<FacetChangesDto>;
    private removeFacetSelectionSubj;
    removeFacetSelection$: import("rxjs").Observable<SiiFacetDto>;
    private removeAllFacetSelectionSubj;
    removeAllFacetSelection$: import("rxjs").Observable<void>;
    changeFacetsRequestSubj: Subject<{
        facets: object;
        reset: boolean;
    }>;
    changeFacetsRequestObs: import("rxjs").Observable<{
        facets: object;
        reset: boolean;
    }>;
    changeSearchTextRequestSubj: Subject<string>;
    changeSearchTextRequestObs: import("rxjs").Observable<string>;
    initializeFacet(name: string, optionsInitValue: any[] | boolean | string): void;
    searchFilterChange: (txt: any, propagateChange?: boolean) => void;
    registerFacetLabel(key: any, label: any): void;
    facetChange(facetChange: SiiFacetDto, propagateChange?: boolean): void;
    private emitFacetChange;
    setInitFacets(initFacets: FacetChangesDto): void;
    removeFacetSelectionFromFacetSummary(facetChange: SiiFacetDto): void;
    removeAllFilters(): void;
    buildBackendData(): void;
    buildSelectionData(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiFacetService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiFacetService>;
}
