import { EventEmitter, AfterViewInit } from '@angular/core';
import { Validator, ControlValueAccessor, AbstractControl, UntypedFormControl } from '@angular/forms';
import { ILookupEmployeeDTO } from './domain/lookup-employee.dto';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as i0 from "@angular/core";
export declare class LookupEmployeeComponent implements Validator, ControlValueAccessor, AfterViewInit {
    appearance: MatFormFieldAppearance;
    minLength: number;
    label: any;
    disabled: boolean;
    required: boolean;
    restService: (txt: string) => Observable<ILookupEmployeeDTO[]>;
    valueChange: EventEmitter<ILookupEmployeeDTO>;
    hideWorkerContactInformation: boolean;
    loadOnInit: boolean;
    siiWorkerContactInformationServiceUrl?: string;
    selectedItem: ILookupEmployeeDTO;
    lookupEmployeeComponentCtrl: UntypedFormControl;
    employeeRestObs: Observable<ILookupEmployeeDTO[]>;
    utils: {
        employeeValid: boolean;
        loadingInProgress: boolean;
    };
    propagateChange: any;
    onTouchedCallback: any;
    validatorCallback: any;
    constructor();
    ngAfterViewInit(): void;
    onSelectionChanged(event: MatAutocompleteSelectedEvent): void;
    displayEmployeeFn(employee: ILookupEmployeeDTO): string | undefined;
    onChange(item: ILookupEmployeeDTO): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    validate(control: AbstractControl): {
        [key: string]: any;
    } | null;
    registerOnValidatorChange?(fn: () => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LookupEmployeeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LookupEmployeeComponent, "sii-lookup-employee", never, { "appearance": { "alias": "appearance"; "required": false; }; "minLength": { "alias": "minLength"; "required": false; }; "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "required": { "alias": "required"; "required": false; }; "restService": { "alias": "restService"; "required": false; }; "hideWorkerContactInformation": { "alias": "hideWorkerContactInformation"; "required": false; }; "loadOnInit": { "alias": "loadOnInit"; "required": false; }; "siiWorkerContactInformationServiceUrl": { "alias": "siiWorkerContactInformationServiceUrl"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}
