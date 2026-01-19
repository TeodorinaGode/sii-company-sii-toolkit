import { OnInit, EventEmitter } from '@angular/core';
import { SiiFacetOptionDto } from '../dto/i-sii-facet-option.dto';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as i0 from "@angular/core";
export declare class FacetSearchComponent implements OnInit {
    options: SiiFacetOptionDto[];
    selected: object;
    optionSelected: EventEmitter<SiiFacetOptionDto>;
    myControl: UntypedFormControl;
    filteredOptions: Observable<SiiFacetOptionDto[]>;
    constructor();
    ngOnInit(): void;
    private _filter;
    displayFn(option: SiiFacetOptionDto): string;
    optionSelectedAction(sel: MatAutocompleteSelectedEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FacetSearchComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FacetSearchComponent, "sii-facet-search", never, { "options": { "alias": "options"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; }, { "optionSelected": "optionSelected"; }, never, never, true, never>;
}
